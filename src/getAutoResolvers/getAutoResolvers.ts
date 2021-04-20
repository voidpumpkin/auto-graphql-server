import type Knex from 'knex';
import type { IResolvers } from '@graphql-tools/utils';
import type { GraphQLSchema } from 'graphql';
import { getMutationResolvers } from './getMutationResolvers';
import { getQueryResolvers } from './getQueryResolvers';

export function getAutoResolvers({
    sourceSchema,
    knex,
}: {
    sourceSchema: GraphQLSchema;
    knex: Knex;
}): IResolvers {
    const queryResolvers = getQueryResolvers(sourceSchema, knex);
    const mutationResolvers = getMutationResolvers(sourceSchema, knex);
    return { ...queryResolvers, ...mutationResolvers };
}
