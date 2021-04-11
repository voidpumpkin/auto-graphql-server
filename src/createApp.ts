import Knex from 'knex';
import Koa from 'koa';
import mount from 'koa-mount';
import graphqlHTTP from 'koa-graphql';
import { addResolversToSchema } from '@graphql-tools/schema';

import { getSourceSchema } from './getSourceSchema';
import { getAutoResolvers } from './getAutoResolvers';
import { generateTables } from './generateTables/generateTables';
import { log } from './logger';

import type { GraphQLSchema } from 'graphql';

type Config = {
    port?: number;
    schemaPath?: string;
    printSql?: boolean;
    graphqlHTTP?: Omit<graphqlHTTP.Options, 'schema'>;
    database?: Knex.Config;
};

export async function createApp({
    config,
    sourceSchema,
    knex,
}: {
    config: Config | undefined;
    sourceSchema?: GraphQLSchema;
    knex?: Knex;
}): Promise<Koa<Koa.DefaultState, Koa.DefaultContext>> {
    if (!config) {
        throw new Error('missing config');
    }
    if (!config?.database || typeof config.database !== 'object') {
        throw new Error('config database field is incorrect or missing');
    }

    knex = knex || Knex(config.database);
    if (config.printSql) {
        knex.on('query', function (queryData) {
            log('📫📭📬', `\x1b[0m\x1b[36m${queryData.sql}\x1b[0m`);
        });
    }

    try {
        sourceSchema = sourceSchema || getSourceSchema({ schemaPath: config.schemaPath });
    } catch (e) {
        console.error('Your schema has errors: ');
        throw e;
    }

    try {
        await generateTables({ sourceSchema, knex });
    } catch (e) {
        console.error('Error happened while generating tables: ');
        throw e;
    }

    let autoResolvers;
    try {
        autoResolvers = await getAutoResolvers({ sourceSchema, knex });
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
}
