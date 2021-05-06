import { GraphQLObjectType, GraphQLField, GraphQLInterfaceType } from 'graphql';

export function recursivelyGetAllFields(
    field: GraphQLField<all, all> | { type: GraphQLObjectType | GraphQLInterfaceType }
): GraphQLField<all, all>[] {
    let directSubFields: GraphQLField<all, all>[];
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
