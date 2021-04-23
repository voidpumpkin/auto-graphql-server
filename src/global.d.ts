declare type Config = {
    port?: number;
    printSql?: boolean;
    skipDbCreationIfExists?: boolean;
    deleteDbCreationIfExists?: boolean;
    graphqlHTTP?: Omit<graphqlHTTP.Options, 'schema'>;
    database?: Knex.Config;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type CustomResolverBuilder = (...args: any[]) => void;
declare type CustomResolverBuilderMap = Record<string, Record<string, CustomResolverBuilder>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type AnyRecord = Record<string, any>;
