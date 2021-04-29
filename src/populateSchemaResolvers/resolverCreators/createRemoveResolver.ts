import Knex from 'knex';
import { NO_TABLE } from '../../directives/directives';
import { hasDirectives } from '../../directives/hasDirectives';
import { IFieldResolver } from 'graphql-tools';
import { getParentFieldValue } from '../../directives/getParentFieldValue';
import { getParentListDirective } from '../../directives/getParentListDirective';

export function createRemoveResolver(
    knex: Knex,
    returnTypeName: string,
    listFields: GraphQLListTypeFieldMap
): IFieldResolver<all, all> {
    return async (_root, args) => {
        const filter = args?.filter || {};
        const knexResult = await knex(returnTypeName).select().where(filter);
        const results = knexResult.map((r: all) => r?.id);
        await Promise.all(
            Object.values(listFields).map(async (field) => {
                const parentDirective = getParentListDirective(field.astNode);
                if (parentDirective) {
                    const parentFieldValue = getParentFieldValue(parentDirective);
                    const listTableName = `__${field.type.ofType.name}_${parentFieldValue}_list`;
                    const foreignKeyName = `${field.type.ofType.name}_${parentFieldValue}_${returnTypeName}_id`;
                    await knex(listTableName).whereIn(foreignKeyName, results).delete();
                    return;
                }
                if (hasDirectives(field.astNode, [NO_TABLE])) {
                    return;
                }
                const listTableName = `__${returnTypeName}_${field.name}_list`;
                await knex(listTableName).whereIn(`${returnTypeName}_id`, results).delete();
            })
        );
        await knex(returnTypeName).where(filter).delete();
        return results;
    };
}
