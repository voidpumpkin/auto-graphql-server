import {
    GRAPHQL_INT,
    GRAPHQL_FLOAT,
    GRAPHQL_STRING,
    GRAPHQL_BOOL,
    GRAPHQL_ID,
    KnexColumnType,
    KNEX_BOOL,
    KNEX_FLOAT,
    KNEX_INT,
    KNEX_STRING,
} from './constants';

export const graphqlScalarToKnexTypeMap = {
    [GRAPHQL_INT]: KNEX_INT,
    [GRAPHQL_FLOAT]: KNEX_FLOAT,
    [GRAPHQL_STRING]: KNEX_STRING,
    [GRAPHQL_BOOL]: KNEX_BOOL,
};

export const getKnexColumnType = (graphqlType: string): KnexColumnType => {
    if (
        graphqlType !== GRAPHQL_INT &&
        graphqlType !== GRAPHQL_FLOAT &&
        graphqlType !== GRAPHQL_STRING &&
        graphqlType !== GRAPHQL_BOOL
    ) {
        return KNEX_STRING;
    }
    return graphqlScalarToKnexTypeMap[graphqlType];
};

export default graphqlScalarToKnexTypeMap;
