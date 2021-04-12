import Knex from 'knex';
import { GraphQLSchema, isObjectType } from 'graphql';

export async function insertRootObjects(sourceSchema: GraphQLSchema, knex: Knex): Promise<void> {
    const queryType = sourceSchema.getQueryType();
    if (!isObjectType(queryType)) {
        throw Error('Not query not object type');
    }
    await knex(queryType.name).insert({});
}
