import { GraphQLType, isEqualType } from 'graphql';
import Knex from 'knex';

type ModifyRootObject = (
    info: Record<string, all>,
    root: Record<string, all>,
    knex: Knex
) => Promise<Record<string, all>>;

export function createModifyRootObject(
    queryTypeName: string,
    rootTypeName: string,
    rootType: GraphQLType | null | undefined
): ModifyRootObject {
    return async (info, root, knex) => {
        if (!rootType) {
            throw Error(`${rootTypeName} type not defined`);
        }
        if (!root && isEqualType(info.parentType, rootType)) {
            root = await knex(queryTypeName).select('*').first();
            if (!root) {
                throw Error(`Failed to query ${queryTypeName}}`);
            }
        }
        return root;
    };
}
