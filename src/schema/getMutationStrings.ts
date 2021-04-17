import { isScalarType, GraphQLObjectType, isListType } from 'graphql';

export function getMutationStrings(
    namedType: GraphQLObjectType,
    methodNames: string[] = ['add', 'update', 'delete']
): { mutationFieldAdditions: string; inputTypes: string } {
    const typeMutationNames = methodNames.map((methodName) => `${methodName}${namedType.name}`);
    const mutationFieldAdditions = typeMutationNames.reduce((prev, mutationName) => {
        return `${prev}${mutationName}(input: ${mutationName}Input): ${namedType.name} `;
    }, '');
    const mutationInputFields = Object.values(namedType.getFields()).reduce(
        (prev, { name, type }) => {
            if (isScalarType(type)) {
                return `${prev}${name}: ${type.name} `;
            } else if (isListType(type)) {
                const ofType = type.ofType;
                if (isScalarType(ofType)) {
                    return `${prev}${name}: [${ofType.name}] `;
                }
                return `${prev}${name}: [ID] `;
            }
            return `${prev}${name}: ID `;
        },
        ''
    );
    const inputTypes = typeMutationNames.reduce((prev, mutationName) => {
        return `${prev}input ${mutationName}Input { ${mutationInputFields} } `;
    }, '');
    return { mutationFieldAdditions, inputTypes };
}
