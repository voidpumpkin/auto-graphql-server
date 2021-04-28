import Koa from 'koa';
import mount from 'koa-mount';
import graphqlHTTP from 'koa-graphql';
import { GraphQLSchema } from 'graphql';
import Knex from 'knex';

import { makeResolverlessSchema } from './makeResolverlessSchema/makeResolverlessSchema';
import { populateSchemaWithResolvers } from './populateSchemaResolvers/populateSchemaResolvers';
import { generateDatabase } from './generateDatabase/generateDatabase';
import { insertRootQueryObject } from './generateDatabase/insertRootQueryObject';

export async function createApp({
    config,
    typeDefs,
    customResolverBuilderMap,
}: {
    config: Config;
    typeDefs: string;
    customResolverBuilderMap?: CustomResolverBuilderMap;
}): Promise<{ app: Koa<Koa.DefaultState, Koa.DefaultContext>; knex: Knex }> {
    let sourceSchema: GraphQLSchema;
    try {
        sourceSchema = makeResolverlessSchema(typeDefs);
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
        await insertRootQueryObject(sourceSchema, knex);
    } catch (e) {
        console.error('Error happened while inserting root objects into database');
        throw e;
    }

    const schema = populateSchemaWithResolvers({
        schema: sourceSchema,
        knex,
        customResolverBuilderMap,
    });

    const app = new Koa();

    app.use(mount(graphqlHTTP({ schema, ...config.graphqlHTTP })));

    return { app, knex };
}
