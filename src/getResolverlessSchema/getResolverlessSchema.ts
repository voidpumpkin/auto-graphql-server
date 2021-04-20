import fs from 'fs';
import path from 'path';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeSchemas } from '@graphql-tools/merge';

import { GraphQLSchema } from 'graphql';
import { validateQueryType } from './validateQueryType';
import { validateObjectTypesIdFields } from './validateObjectTypesIdFields';
import { validateAutomaticlyGenerated } from './validateAutomaticlyGenerated';
import { getMutationTypeDefs } from './getMutationTypeDefs';

export function getResolverlessSchema({
    schemaPath,
    typeDefs,
}: {
    schemaPath?: string;
    typeDefs?: string;
}): GraphQLSchema {
    if (!typeDefs) {
        if (!schemaPath) {
            throw Error('TypeDefs or SchemaPath required');
        }
        const schemaFilePath = path.join(__dirname, `../${schemaPath}`);
        typeDefs = fs.readFileSync(schemaFilePath, 'utf8');
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
