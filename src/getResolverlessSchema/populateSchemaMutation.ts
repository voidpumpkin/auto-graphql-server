import { GraphQLSchema, isEqualType, isObjectType, GraphQLObjectType } from 'graphql';
import { getMutationStrings, defaultInputArg } from './getMutationStrings';
import { mergeSchemas } from '@graphql-tools/merge';

export function populateSchemaMutation(schema: GraphQLSchema): GraphQLSchema {
    const schemaTypeMap = schema.getTypeMap();
    let mutationTypeDefs = 'schema { mutation: Mutation } ';
    let mutationFields = '';

    const namedTypes = Object.entries(schemaTypeMap)
        .filter(([key, val]) => isObjectType(val) && key.substr(0, 2) !== '__')
        .map(([, val]) => val as GraphQLObjectType);

    namedTypes.map(async (namedType) => {
        const queryType = schema.getQueryType();
        if (!queryType) {
            throw Error('QueryType not defined');
        } else if (isEqualType(namedType, queryType)) {
            const { rootMutationFields, inputTypes } = getMutationStrings(namedType, {
                update: { args: [defaultInputArg], returnsList: true },
            });
            mutationFields += rootMutationFields;
            mutationTypeDefs += inputTypes;
        } else {
            const { rootMutationFields, inputTypes } = getMutationStrings(namedType);
            mutationFields += rootMutationFields;
            mutationTypeDefs += inputTypes;
        }
    });

    if (!mutationFields) {
        return schema;
    }
    mutationTypeDefs += `type Mutation { ${mutationFields}} `;

    return mergeSchemas({
        schemas: [schema],
        typeDefs: mutationTypeDefs,
    });
}
