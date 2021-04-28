/* eslint-disable @typescript-eslint/no-explicit-any */
declare type Config = {
    port?: number;
    printSql?: boolean;
    skipDbCreationIfExists?: boolean;
    deleteDbCreationIfExists?: boolean;
    graphqlHTTP?: Omit<graphqlHTTP.Options, 'schema'>;
    database?: Knex.Config;
};

declare type CustomResolverBuilder = (...args: any[]) => void;
declare type CustomResolverBuilderMap = Record<string, Record<string, CustomResolverBuilder>>;

declare type AnyRecord = Record<string, any>;

type GraphQLList = import('graphql').GraphQLList<any>;
type GraphQLField = import('graphql').GraphQLField<any, any>;
type GraphQLOutputType = import('graphql').GraphQLOutputType;

declare type GraphQLNotListTypeField = {
    type: Exclude<GraphQLOutputType, GraphQLList>;
} & Omit<GraphQLField, 'type'>;
declare type GraphQLNotListTypeFieldMap = Record<string, GraphQLNotListTypeField>;

declare type GraphQLListTypeField = { type: GraphQLList } & Omit<GraphQLField, 'type'>;
declare type GraphQLListTypeFieldMap = Record<string, GraphQLListTypeField>;
