import Knex from 'knex';
import { NO_TABLE } from '../../directives/directives';
import { hasDirectives } from '../../directives/hasDirectives';
import { IFieldResolver } from 'graphql-tools';
import { getParentListDirective } from '../../directives/getParentListDirective';
import { syncAsyncForEatch } from '../../utils/syncAsyncForEatch';
import { createParentListData } from './utils/createParentListData';
import { createObjectListData } from './utils/createObjectListData';

export function createRemoveResolver(
    knex: Knex,
    returnTypeName: string,
    listFields: GraphQLListTypeFieldMap
): IFieldResolver<all, all> {
    return async (_root, args) => {
        const filter = args?.filter || {};
        const knexResult = await knex(returnTypeName).select().where(filter);
        const results = knexResult.map((r: all) => r?.id);
        await syncAsyncForEatch(Object.values(listFields), async (field) => {
            const parentListDirective = getParentListDirective(field.astNode);
            if (parentListDirective) {
                const parentListData = createParentListData(
                    parentListDirective,
                    field.type.ofType.name,
                    returnTypeName
                );
                await knex(parentListData.tableName)
                    .whereIn(parentListData.childKeyOrValueName, results)
                    .delete();
            } else if (!hasDirectives(field.astNode, [NO_TABLE])) {
                const objectListData = createObjectListData(returnTypeName, field.name, '');
                await knex(objectListData.tableName)
                    .whereIn(objectListData.parentKeyName, results)
                    .delete();
            }
        });
        await knex(returnTypeName).where(filter).delete();
        return results;
    };
}
