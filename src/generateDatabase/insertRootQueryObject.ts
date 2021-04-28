import Knex from 'knex';
import { GraphQLSchema, isObjectType } from 'graphql';

export async function insertRootQueryObject(
    sourceSchema: GraphQLSchema,
    knex: Knex
): Promise<void> {
    const queryType = sourceSchema.getQueryType();
    if (!isObjectType(queryType)) {
        throw Error('Query not object type');
    }
    await knex(queryType.name).insert({});
}
