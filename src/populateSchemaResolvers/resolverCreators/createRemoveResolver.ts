import Knex from 'knex';
import { NO_TABLE, PARENTS_LIST } from '../../directives/directives';
import { hasDirectives } from '../../directives/hasDirectives';
import { IFieldResolver } from 'graphql-tools';

export function createRemoveResolver(
    knex: Knex,
    returnTypeName: string,
    listFields: GraphQLListTypeFieldMap
): IFieldResolver<all, all> {
    return async (_root, args) => {
        const filter = args?.filter || {};
        const knexResult = await knex(returnTypeName).select().where(filter);
        const results = knexResult.map((r: all) => r?.id);
        await knex(returnTypeName).where(filter).delete();
        await Promise.all(
            Object.values(listFields).map(async ({ astNode, name }) => {
                if (hasDirectives(astNode, [NO_TABLE, PARENTS_LIST])) {
                    return;
                }
                const listTableName = `__${returnTypeName}_${name}_list`;
                await knex(listTableName).whereIn(`${returnTypeName}_id`, results).delete();
            })
        );
        return results;
    };
}
