import { isScalarType, isObjectType, DirectiveNode, GraphQLObjectType } from 'graphql';
import Knex from 'knex';
import { getArgInputs } from './utils/getArgInputs';
import { createObjectTypeFieldResolver } from './createObjectTypeFieldResolver';
import { IFieldResolver } from 'graphql-tools';
import { getParentFieldValue } from '../../directives/getParentFieldValue';
import { getParentListDirective } from '../../directives/getParentListDirective';

export function createAddResolver(
    listFields: GraphQLListTypeFieldMap,
    nonListFields: GraphQLNotListTypeFieldMap,
    knex: Knex,
    queryTypeName: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): IFieldResolver<any, any> {
    return async (_, args, __, info) => {
        const returnType = info.returnType;
        if (!isObjectType(returnType)) {
            throw Error(`${info.fieldName} return type not an object`);
        }

        const [nonListInputs, listInputs] = getArgInputs(args.input, listFields, nonListFields);

        const insertResultId = (
            await knex(returnType.name).returning('id').insert(nonListInputs)
        )[0];

        await Promise.all(
            Object.entries(listInputs).map(async ([inputName, valueList]) =>
                Promise.all(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    valueList.map(async (value: any) => {
                        const parentListDirective = getParentListDirective(
                            listFields[inputName].astNode
                        );
                        const parentTypeName: string = listFields[inputName].type.ofType.name;
                        if (isScalarType(listFields[inputName].type.ofType)) {
                            await insertScalarListValue(
                                knex,
                                value,
                                returnType,
                                inputName,
                                insertResultId
                            );
                        } else if (parentListDirective) {
                            await insertParentListValues(
                                parentListDirective,
                                parentTypeName,
                                returnType,
                                knex,
                                insertResultId,
                                value
                            );
                        } else if (isObjectType(listFields[inputName].type.ofType)) {
                            await insertObjectListValues(
                                knex,
                                returnType,
                                inputName,
                                parentTypeName,
                                value,
                                insertResultId
                            );
                        }
                    })
                )
            )
        );
        const returnResolver = createObjectTypeFieldResolver(
            knex,
            returnType,
            queryTypeName,
            insertResultId
        );
        return await returnResolver({}, undefined, undefined, info);
    };
}

async function insertObjectListValues(
    knex: Knex,
    returnType: GraphQLObjectType,
    inputName: string,
    parentTypeName: string,
    value: string,
    insertResultId: number
) {
    const listTableName = `__${returnType.name}_${inputName}_list`;
    await knex(listTableName).insert({
        [`${returnType.name}_${inputName}_${parentTypeName}_id`]: value,
        [`${returnType.name}_id`]: insertResultId,
    });
}

async function insertScalarListValue(
    knex: Knex,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    returnType: GraphQLObjectType,
    inputName: string,
    insertResultId: number
) {
    const listTableName = `__${returnType.name}_${inputName}_list`;
    await knex(listTableName).insert({
        value,
        [`${returnType.name}_${inputName}_id`]: insertResultId,
    });
}

async function insertParentListValues(
    parentListDirective: DirectiveNode,
    parentTypeName: string,
    returnType: GraphQLObjectType,
    knex: Knex,
    childId: number,
    parentId: string
) {
    const parentFieldArgValue = getParentFieldValue(parentListDirective);
    const parentFieldListTableName = `__${parentTypeName}_${parentFieldArgValue}_list`;
    const parentFieldListChildForeignKey = `${parentTypeName}_${parentFieldArgValue}_${returnType.name}_id`;
    const parentForeignKey = `${parentTypeName}_id`;

    await knex(parentFieldListTableName).insert({
        [parentFieldListChildForeignKey]: childId,
        [parentForeignKey]: parentId,
    });
}
