import { isScalarType } from 'graphql';
import Knex from 'knex';
import { getArgInputs } from './utils/getArgInputs';
import { createModifyRootObject } from './utils/createModifyRootObject';
import { IFieldResolver } from 'graphql-tools';

export function createUpdateResolver(
    queryTypeName: string,
    mutationTypeName: string,
    knex: Knex,
    listFields: GraphQLListTypeFieldMap,
    nonListFields: GraphQLNotListTypeFieldMap,
    isQueryType: boolean,
    returnTypeName: string
): IFieldResolver<all, all> {
    return async (root, args, __, info) => {
        const mutationType = info.schema.getMutationType();
        const modifyRootObject = createModifyRootObject(
            queryTypeName,
            mutationTypeName,
            mutationType
        );
        root = await modifyRootObject(info, root, knex);

        const [nonListInputs, listInputs] = getArgInputs(args.input, listFields, nonListFields);
        const filters = args?.filter || {};
        const queryWhere = isQueryType ? { id: root.id } : filters;
        if (!Object.keys(queryWhere).length) {
            throw Error('No filters provided');
        }
        const queryResults = await knex(returnTypeName).where(queryWhere).select('id');
        const updatingRowIds = queryResults.map((e) => e.id);
        if (Object.keys(nonListInputs).length) {
            await knex(returnTypeName).update(nonListInputs).whereIn('id', updatingRowIds);
        }
        await Promise.all(
            Object.entries(listInputs).map(async ([inputName, valueList]) => {
                const tableName = `__${returnTypeName}_${inputName}_list`;
                const relationshipName = `${returnTypeName}_id`;
                const valueColumnName = isScalarType(listFields[inputName].type.ofType)
                    ? 'value'
                    : `${returnTypeName}_${inputName}_${listFields[inputName].type.ofType.name}_id`;
                await knex(tableName)
                    .where({ [relationshipName]: root.id })
                    .delete();
                await valueList.reduce(async (prevPromise: Promise<void>, value: all) => {
                    await prevPromise;
                    await knex(tableName).insert({
                        [valueColumnName]: value,
                        [relationshipName]: root.id,
                    });
                }, Promise.resolve(undefined));
            })
        );
        return await knex(returnTypeName).select().where(queryWhere);
    };
}
