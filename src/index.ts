import Koa from 'koa';
import mount from 'koa-mount';
import fs from 'fs';
import path from 'path';
import Knex from 'knex';
import { isScalarType, isObjectType } from 'graphql';
import graphqlHTTP from 'koa-graphql';
import { makeExecutableSchema, addResolversToSchema } from '@graphql-tools/schema';
import { IResolvers } from '@graphql-tools/utils';

const PORT = 3000;

const main = async (graphiql = true): Promise<Koa<Koa.DefaultState, Koa.DefaultContext>> => {
    const knex = Knex({
        client: 'sqlite3',
        connection: {
            filename: './test.sqlite3',
        },
        useNullAsDefault: true,
    });

    const schemaFilePath = path.join(__dirname, '../schema.graphql');
    const schemaFile = fs.readFileSync(schemaFilePath, 'utf8');

    const schema = makeExecutableSchema({ typeDefs: schemaFile });

    const autoResolvers: IResolvers = {};
    const schemaTypeMap = schema.getTypeMap();
    const namedTypesNames = Object.entries(schemaTypeMap)
        .filter(([key, val]) => !isScalarType(val) && key.substr(0, 2) !== '__')
        .map(([key]) => key);

    await Promise.all(
        namedTypesNames.map(async (name) => {
            //create resolver object
            autoResolvers[name] = {};
            //resolver
            const namedType = schemaTypeMap[name];
            if (!isObjectType(namedType)) {
                throw new Error('Not object type');
            }
            const fields = Object.entries(namedType.getFields())
                .filter(([, fieldType]) => !isScalarType(fieldType.type))
                .map(([fieldName, fieldType]) => [fieldName, fieldType.name]);
            fields.forEach(([fieldName, fieldTypeName]) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                autoResolvers[name][fieldName] = async () =>
                    await knex.select('*').table(fieldTypeName).first();
            });
            //fields
            const scalarFieldNames = Object.entries(namedType.getFields())
                .filter(([, val]) => isScalarType(val.type))
                .map(([key]) => key);
            if (!scalarFieldNames.length) {
                return;
            }
            //create table
            if (await knex.schema.hasTable(name)) {
                return;
            }
            await knex.schema.createTable(name, (tableBuilder) => {
                scalarFieldNames.forEach((fieldName) => tableBuilder['string'](fieldName));
            });
            //mock data
            const insertable = scalarFieldNames.map((fieldName) => ({ [fieldName]: 'bob' }));
            await knex(name).insert(insertable);
        })
    );

    const schemaWithResolvers = addResolversToSchema({ schema, resolvers: autoResolvers });

    const app = new Koa();

    app.use(
        mount(
            '/',
            graphqlHTTP({
                schema: schemaWithResolvers,
                graphiql,
            })
        )
    );

    // this module was run directly from the command line
    if (require.main === module) {
        console.log(`Listening at http://localhost:${PORT}`);
        app.listen(PORT);
    }

    return app;
};

// this module was run directly from the command line
if (require.main === module) {
    main();
}

export default main;
