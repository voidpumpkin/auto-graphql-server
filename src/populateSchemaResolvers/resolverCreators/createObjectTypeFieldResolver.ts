import { GraphQLObjectType } from 'graphql';
import Knex from 'knex';
import { IFieldResolver } from 'graphql-tools';
import { createModifyRootObject } from './utils/createModifyRootObject';
import { getSelections } from './utils/getSelections';

export function createObjectTypeFieldResolver(
    knex: Knex,
    fieldType: GraphQLObjectType,
    queryTypeName: string,
    objectId?: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): IFieldResolver<any, any, any> {
    const resultTypeFields = fieldType.getFields();
    const resultTypeName = fieldType.name;

    return async (root, args, __, info) => {
        const queryType = info.schema.getQueryType();
        const modifyRootObject = createModifyRootObject(queryTypeName, queryTypeName, queryType);
        root = await modifyRootObject(info, root, knex);

        const selections = getSelections(info, resultTypeFields);

        const queryWhere = { id: objectId ?? root[info.fieldName], ...(args?.filter || {}) };

        const result = await knex(resultTypeName)
            .select(...selections)
            .where(queryWhere);
        if (result.length > 1) {
            throw Error('More than one found');
        }
        return result[0];
    };
}
