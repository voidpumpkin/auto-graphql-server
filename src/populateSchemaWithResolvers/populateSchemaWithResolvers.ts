import type Knex from 'knex';
import type { IResolvers } from '@graphql-tools/utils';
import type { GraphQLSchema } from 'graphql';
import { getMutationResolvers } from './getMutationResolvers';
import { getQueryResolvers } from './getQueryResolvers';
import merge from 'lodash.merge';
import { addResolversToSchema } from 'graphql-tools';
import { getCustomResolvers } from './getCustomResolvers';

export function populateSchemaWithResolvers({
    schema,
    knex,
    customResolverBuilderMap,
}: {
    schema: GraphQLSchema;
    knex: Knex;
    customResolverBuilderMap?: CustomResolverBuilderMap;
}): GraphQLSchema {
    let resolvers: IResolvers = {};
    try {
        const queryResolverMap = getQueryResolvers(schema, knex);
        const mutationResolverMap = getMutationResolvers(schema, knex);
        resolvers = merge(queryResolverMap, mutationResolverMap);
    } catch (e) {
        console.error('Error happened while generating resolvers: ');
        throw e;
    }
    try {
        if (customResolverBuilderMap) {
            const customResolverMap = getCustomResolvers(customResolverBuilderMap, knex);
            resolvers = merge(resolvers, customResolverMap);
        }
    } catch (e) {
        console.error('Error happened adding custom resolvers: ');
        throw e;
    }
    return addResolversToSchema({ schema, resolvers });
}
