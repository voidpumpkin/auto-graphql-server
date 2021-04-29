import { isScalarType, isObjectType } from 'graphql';
import Knex from 'knex';
import { getArgInputs } from './utils/getArgInputs';
import { IFieldResolver } from 'graphql-tools';
import { getParentListDirective } from '../../directives/getParentListDirective';
import { createParentListData } from './utils/createParentListData';
import { insertListValue } from './utils/insertListValue';
import { createObjectListData } from './utils/createObjectListData';
import { createScalarListData } from './utils/createScalarListData';
import { syncAsyncForEatch } from '../../utils/syncAsyncForEatch';

export function createAddResolver(
    listFields: GraphQLListTypeFieldMap,
    nonListFields: GraphQLNotListTypeFieldMap,
    knex: Knex
): IFieldResolver<all, all> {
    return async (_, args, __, info) => {
        const returnType = info.returnType;
        if (!isObjectType(returnType)) {
            throw Error(`${info.fieldName} return type not an object`);
        }

        const [nonListInputs, listInputs] = getArgInputs(args.input, listFields, nonListFields);

        const insertResultId = (
            await knex(returnType.name).returning('id').insert(nonListInputs)
        )[0];

        await syncAsyncForEatch(Object.entries(listInputs), async ([inputName, valueList]) => {
            await syncAsyncForEatch<all>(valueList, async (value) => {
                const parentListDirective = getParentListDirective(listFields[inputName].astNode);
                const parentTypeName: string = listFields[inputName].type.ofType.name;
                if (isScalarType(listFields[inputName].type.ofType)) {
                    const scalarListData = createScalarListData(returnType.name, inputName);
                    await insertListValue(scalarListData, knex, value, insertResultId);
                } else if (parentListDirective) {
                    const parentListData = createParentListData(
                        parentListDirective,
                        parentTypeName,
                        returnType.name
                    );
                    await insertListValue(parentListData, knex, insertResultId, value);
                } else if (isObjectType(listFields[inputName].type.ofType)) {
                    const objectListData = createObjectListData(
                        returnType.name,
                        inputName,
                        parentTypeName
                    );
                    await insertListValue(objectListData, knex, value, insertResultId);
                }
            });
        });

        return await knex(returnType.name).select().where({ id: insertResultId }).first();
    };
}
