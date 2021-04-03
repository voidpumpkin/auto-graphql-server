const KNEX_INT = 'integer' as const;
const KNEX_FLOAT = 'float' as const;
const KNEX_STRING = 'string' as const;
const KNEX_BOOL = 'boolean' as const;
const KNEX_ID = 'increments' as const;

const GRAPHQL_INT = 'Int' as const;
const GRAPHQL_FLOAT = 'Float' as const;
const GRAPHQL_STRING = 'String' as const;
const GRAPHQL_BOOL = 'Boolean' as const;
const GRAPHQL_ID = 'ID' as const;

type KnexColumnType =
    | typeof KNEX_INT
    | typeof KNEX_FLOAT
    | typeof KNEX_STRING
    | typeof KNEX_BOOL
    | typeof KNEX_ID;

export const graphqlScalarToKnexTypeMap = {
    [GRAPHQL_INT]: KNEX_INT,
    [GRAPHQL_FLOAT]: KNEX_FLOAT,
    [GRAPHQL_STRING]: KNEX_STRING,
    [GRAPHQL_BOOL]: KNEX_BOOL,
    [GRAPHQL_ID]: KNEX_ID,
};

export const getKnexColumnType = (graphqlType: string): KnexColumnType => {
    if (
        graphqlType !== GRAPHQL_INT &&
        graphqlType !== GRAPHQL_FLOAT &&
        graphqlType !== GRAPHQL_STRING &&
        graphqlType !== GRAPHQL_BOOL &&
        graphqlType !== GRAPHQL_ID
    ) {
        return KNEX_STRING;
    }
    return graphqlScalarToKnexTypeMap[graphqlType];
};

export default graphqlScalarToKnexTypeMap;
