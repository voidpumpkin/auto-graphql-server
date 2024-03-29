import { GraphQLObjectType, isObjectType } from 'graphql';

export function validateQueryType(queryType: undefined | null | GraphQLObjectType): void {
    if (!queryType) {
        return;
    }
    if (!isObjectType(queryType)) {
        throw Error('query type has to be an object');
    }
}
