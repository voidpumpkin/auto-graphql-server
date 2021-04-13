import Koa from 'koa';
import mount from 'koa-mount';
import graphqlHTTP from 'koa-graphql';
import { addResolversToSchema } from '@graphql-tools/schema';
import { GraphQLSchema } from 'graphql';
import Knex from 'knex';

import { getSourceSchema } from './schema/getSourceSchema';
import { getAutoResolvers } from './getAutoResolvers';
import { generateDatabase } from './generateDatabase/generateDatabase';
import { insertRootObjects } from './insertRootObjects';

export type Config = {
    port?: number;
    schemaPath?: string;
    printSql?: boolean;
    skipDbCreationIfExists?: boolean;
    deleteDbCreationIfExists?: boolean;
    graphqlHTTP?: Omit<graphqlHTTP.Options, 'schema'>;
    database?: Knex.Config;
};

export async function createApp({
    config,
    sourceSchema,
}: {
    config: Config | undefined;
    sourceSchema?: GraphQLSchema;
}): Promise<{ app: Koa<Koa.DefaultState, Koa.DefaultContext>; knex: Knex }> {
    if (!config) {
        throw Error('missing config');
    }

    try {
        sourceSchema = sourceSchema || getSourceSchema({ schemaPath: config.schemaPath });
    } catch (e) {
        console.error('Your schema has errors: ');
        throw e;
    }

    let knex: Knex;
    try {
        knex = await generateDatabase({ sourceSchema, config });
    } catch (e) {
        console.error('Error happened while generating tables: ');
        throw e;
    }

    try {
        await insertRootObjects(sourceSchema, knex);
    } catch (e) {
        console.error('Error happened while insertinf root objects into database');
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

    return { app, knex };
}
