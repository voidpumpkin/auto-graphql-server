import Knex from 'knex';
import Koa from 'koa';
import mount from 'koa-mount';
import graphqlHTTP from 'koa-graphql';
import { addResolversToSchema } from '@graphql-tools/schema';

import getSourceSchema from './getSourceSchema';
import getAutoResolvers from './getAutoResolvers';

import type { GraphQLSchema } from 'graphql';

type Config = {
    port?: number;
    schemaPath?: string;
    graphqlHTTP?: Omit<graphqlHTTP.Options, 'schema'>;
    database?: Knex.Config;
};

const createApp = async (
    config: Config | undefined,
    sourceSchema?: GraphQLSchema
): Promise<Koa<Koa.DefaultState, Koa.DefaultContext>> => {
    if (!config) {
        throw new Error('missing config');
    }
    if (!config?.database || typeof config.database !== 'object') {
        throw new Error('config database field is incorrect or missing');
    }
    const knex = Knex(config.database);

    try {
        sourceSchema = sourceSchema || getSourceSchema({ schemaPath: config.schemaPath });
    } catch (e) {
        console.error('Your schema has errors: ');
        throw e;
    }

    let autoResolvers;
    try {
        autoResolvers = await getAutoResolvers(sourceSchema, knex);
    } catch (e) {
        console.error('Error happened while generating resolvers: ');
        throw e;
    }

    const schema = addResolversToSchema({
        schema: sourceSchema,
        resolvers: autoResolvers,
    });

    const app = new Koa();

    app.use(mount('/', graphqlHTTP({ schema, ...config.graphqlHTTP })));

    return app;
};
export default createApp;
