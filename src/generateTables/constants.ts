export const KNEX_INT = 'integer' as const;
export const KNEX_FLOAT = 'float' as const;
export const KNEX_STRING = 'string' as const;
export const KNEX_BOOL = 'boolean' as const;

export const GRAPHQL_INT = 'Int' as const;
export const GRAPHQL_FLOAT = 'Float' as const;
export const GRAPHQL_STRING = 'String' as const;
export const GRAPHQL_BOOL = 'Boolean' as const;
export const GRAPHQL_ID = 'ID' as const;

export type KnexColumnType =
    | typeof KNEX_INT
    | typeof KNEX_FLOAT
    | typeof KNEX_STRING
    | typeof KNEX_BOOL;
