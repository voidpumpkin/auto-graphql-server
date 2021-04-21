import fs from 'fs';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeSchemas } from '@graphql-tools/merge';

import { GraphQLSchema } from 'graphql';
import { validateQueryType } from './validateQueryType';
import { validateObjectTypesIdFields } from './validateObjectTypesIdFields';
import { validateAutomaticlyGenerated } from './validateAutomaticlyGenerated';
import { getMutationTypeDefs } from './getMutationTypeDefs';

export function getResolverlessSchema(typeDefs?: string): GraphQLSchema {
    if (!typeDefs) {
        typeDefs = fs.readFileSync('./data/schema.graphql', 'utf8');
    }

    //nesesary for validation before adding generated fields and types
    const userDefinedSchema = makeExecutableSchema({ typeDefs });

    //Validations
    validateObjectTypesIdFields(userDefinedSchema.getTypeMap());
    validateQueryType(userDefinedSchema.getQueryType());
    validateAutomaticlyGenerated(userDefinedSchema);

    const mutationTypeDefs = getMutationTypeDefs(userDefinedSchema);

    const schema = mergeSchemas({
        schemas: [userDefinedSchema],
        typeDefs: mutationTypeDefs,
    });

    return schema;
}
