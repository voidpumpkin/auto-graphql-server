# auto-graphql-server

auto-graphql-server is a 🐋docker image that automaticly generates a backend from a 📈GraphQL schema.

If you ever are too lazy to implement a simple CRUD backend, go ahead and use this!

-   Only requires a **graphql.schema** and a **config.json** to function
-   Supports **Sqlite** and **MySQL**
-   Contains many [examples](./examples/) to learn from!

## 🏃‍♀️ Running this image

auto-graphql-server requires **graphql.schema** and **config.json** files to function

1. Create a volume for **graphql.schema** and **config.json** files
1. Add a **graphql.schema**, this should have 📈GraphQL type definitions (see [examples](./examples/))
1. Add a [config.json](#📝%20Config.json%20file) file
1. Optionally add a [resolvers.js]() file
1. Run with `docker run -p 3001:3001 -v your_volume:/app/data`

## 📝 Config.json file

```ts
type Config = {
    port?: number;
    printSql?: boolean;
    skipDbCreationIfExists?: boolean;
    deleteDbCreationIfExists?: boolean;
    graphqlHTTP?: Omit<graphqlHTTP.Options, 'schema'>;
    database?: Knex.Config;
};
```

-   `port` for local development, will be overriden by enviroment PORT if provided
-   `printSql` whether or not print all Knex generated SQL commands
-   `skipDbCreationIfExists` whether or not skip table generations for db if they already exist
-   `deleteDbCreationIfExists` sqlite only, will delete
-   `graphqlHTTP` field takes any []() options but most of the time you just want GraphiQL interface with: `{ "graphiql": true }`
-   `database` field is a [Knex.js](https://knexjs.org/#Installation-client) configuration
    -   Supported db clients - **sqlite** and **mysql2**

## 🎨 Custom resolvers

If you need custom functionallity add a **resolvers.js** file.
It looks exatly like [graphql-tools resolver map](https://www.graphql-tools.com/docs/resolvers#resolver-map), except it contains functions that return resolvers, for example:

```js
module.exports = {
    Type_Name_Here: {
        Field_of_that_type_name: function (knex) {
            const resolver = async (root, args, context, info) {
                return await knex('Type_Name_Here').select().where(args);
            };
        }
    }
}
```

More examples in [exmaples folder](./examples)

## 📃 Features

-   This project only works with default GraphQL scalar types
-   Generates tables from `type` fields
-   Not null `!` is not supported
-   Intefaces, Unions, Enums are not supported
-   Directives not verified if they work

## 👷‍♂️ Contributing

### Run locally

-   create a **data** folder with **graphql.schema** and **config.json** files
-   use `yarn` to install dependencies
-   start the project using `yarn dev`

### Testing

-   Run with `yarn test`

### Linting

-   Run with `yarn lint`
