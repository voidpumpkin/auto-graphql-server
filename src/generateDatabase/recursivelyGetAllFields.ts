/* eslint-disable @typescript-eslint/no-explicit-any */
import { GraphQLObjectType, GraphQLField, GraphQLInterfaceType } from 'graphql';

export function recursivelyGetAllFields(
    field: GraphQLField<any, any> | { type: GraphQLObjectType | GraphQLInterfaceType }
): GraphQLField<any, any>[] {
    let directSubFields: GraphQLField<any, any>[];
    if ('type' in field && 'getFields' in field.type) {
        directSubFields = Object.values(field.type.getFields());
    } else {
        return [];
    }
    const interfaces = field.type.getInterfaces();
    if (!interfaces.length) {
        return directSubFields;
    }
    const interfaceFields = interfaces
        .map((i) => ({
            type: i,
        }))
        .map(recursivelyGetAllFields)
        .flat();

    return [...directSubFields, ...interfaceFields];
}
