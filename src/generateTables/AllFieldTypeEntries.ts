import { GraphQLObjectType, GraphQLInterfaceType, GraphQLOutputType } from 'graphql';

type AllFieldTypeEntries = [string, GraphQLOutputType][];

export function recursivelyGetAllFieldTypeEntries(
    objectType: GraphQLObjectType | GraphQLInterfaceType
): AllFieldTypeEntries {
    const directFieldEntries = Object.entries(objectType.getFields());
    const directFieldTypeEntries: AllFieldTypeEntries = directFieldEntries.map(([key, f]) => [
        key,
        f.type,
    ]);
    const interfaces = objectType.getInterfaces();
    if (!interfaces.length) {
        const interfaceFieldEntries = Object.entries(objectType.getFields());
        const interfaceFieldTypeEntries: AllFieldTypeEntries = interfaceFieldEntries.map(
            ([key, f]) => [key, f.type]
        );
        return interfaceFieldTypeEntries;
    }
    const interfaceFieldTypeEntries = interfaces.map(recursivelyGetAllFieldTypeEntries).flat();
    return [...directFieldTypeEntries, ...interfaceFieldTypeEntries];
}
