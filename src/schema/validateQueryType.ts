import { GraphQLObjectType, isObjectType } from 'graphql';
//import { validateQueryFields } from './validateQueryFields';

export function validateQueryType(queryType: undefined | null | GraphQLObjectType): void {
    if (!queryType) {
        return;
    }
    if (!isObjectType(queryType)) {
        throw Error('query type has to be an object');
    }
    //validateQueryFields(queryType);
}
