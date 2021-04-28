import Knex from 'knex';
import { IFieldResolver } from 'graphql-tools';
import { createModifyRootObject } from './utils/createModifyRootObject';

export function createObjectTypeFieldResolver(
    knex: Knex,
    field: GraphQLObjectTypeField,
    queryTypeName: string,
    objectId?: number
): IFieldResolver<all, all, all> {
    const resultTypeName = field.type.name;

    return async (root, args, __, info) => {
        const queryType = info.schema.getQueryType();
        const modifyRootObject = createModifyRootObject(queryTypeName, queryTypeName, queryType);
        root = await modifyRootObject(info, root, knex);

        const queryWhere = { id: objectId ?? root[info.fieldName], ...(args?.filter || {}) };

        const result = await knex(resultTypeName).select().where(queryWhere);
        if (result.length > 1) {
            throw Error('More than one found');
        }
        return result[0];
    };
}
