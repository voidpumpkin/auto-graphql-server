import { GraphQLSchema, isEqualType, isObjectType, GraphQLObjectType } from 'graphql';
import { getMutationStrings } from './getMutationStrings';

export function getMutationTypeDefs(userDefinedSchema: GraphQLSchema): string {
    const schemaTypeMap = userDefinedSchema.getTypeMap();
    let mutationTypeDefs = 'schema { mutation: Mutation } ';
    let mutationFields = '';

    const namedTypes = Object.entries(schemaTypeMap)
        .filter(([key, val]) => isObjectType(val) && key.substr(0, 2) !== '__')
        .map(([, val]) => val as GraphQLObjectType);

    namedTypes.map(async (namedType) => {
        const queryType = userDefinedSchema.getQueryType();
        if (!queryType) {
            throw Error('QueryType not defined');
        } else if (isEqualType(namedType, queryType)) {
            // const { mutationFieldAdditions, inputTypes } = getMutationStrings(namedType, [
            //     'update',
            // ]);
            // mutationFields += mutationFieldAdditions;
            // mutationTypeDefs += inputTypes;
        } else {
            const { mutationFieldAdditions, inputTypes } = getMutationStrings(namedType, ['add']);
            mutationFields += mutationFieldAdditions;
            mutationTypeDefs += inputTypes;
        }
    });

    if (!mutationFields) {
        return '';
    }
    mutationTypeDefs += `type Mutation { ${mutationFields}} `;
    return mutationTypeDefs;
}
