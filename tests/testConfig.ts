/* eslint-disable @typescript-eslint/no-unused-vars */

const sqliteDBConfig = {
    client: 'sqlite',
    connection: {
        filename: ':memory:',
    },
    useNullAsDefault: true,
};

const mysqlDBConfig = {
    client: 'mysql2',
    version: '8',
    connection: {
        host: 'localhost',
        user: 'testuser',
        password: 'testpassword',
        database: 'testdb',
    },
};

export default {
    graphqlHTTP: {
        graphiql: false,
    },
    database: sqliteDBConfig,
};
