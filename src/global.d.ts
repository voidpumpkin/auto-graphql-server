// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type all = any;

declare type Config = {
    port?: number;
    printSql?: boolean;
    skipDbCreationIfExists?: boolean;
    deleteDbCreationIfExists?: boolean;
    graphqlHTTP?: Omit<graphqlHTTP.Options, 'schema'>;
    database?: Knex.Config;
};

declare type CustomResolverBuilder = (...args: all[]) => void;
declare type CustomResolverBuilderMap = Record<string, Record<string, CustomResolverBuilder>>;

type GraphQLList = import('graphql').GraphQLList<all>;
type GraphQLObjectType = import('graphql').GraphQLObjectType;
type GraphQLField = import('graphql').GraphQLField<all, all>;
type GraphQLOutputType = import('graphql').GraphQLOutputType;

declare type GraphQLNotListTypeField = {
    type: Exclude<GraphQLOutputType, GraphQLList>;
} & Omit<GraphQLField, 'type'>;
declare type GraphQLNotListTypeFieldMap = Record<string, GraphQLNotListTypeField>;

declare type GraphQLListTypeField = { type: GraphQLList } & Omit<GraphQLField, 'type'>;
declare type GraphQLListTypeFieldMap = Record<string, GraphQLListTypeField>;

declare type GraphQLObjectTypeField = { type: GraphQLObjectType } & Omit<GraphQLField, 'type'>;
declare type GraphQLObjectTypeFieldMap = Record<string, GraphQLObjectTypeField>;
