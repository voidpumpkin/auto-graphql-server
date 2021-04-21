// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type AnyRecord = Record<string, any>;

declare type Config = {
    port?: number;
    printSql?: boolean;
    skipDbCreationIfExists?: boolean;
    deleteDbCreationIfExists?: boolean;
    graphqlHTTP?: Omit<graphqlHTTP.Options, 'schema'>;
    database?: Knex.Config;
};
