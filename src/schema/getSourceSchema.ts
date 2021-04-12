import fs from 'fs';
import path from 'path';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { GraphQLSchema } from 'graphql';
import { validateQueryType } from './validateQueryType';
import { validateObjectTypesIdFields } from './validateObjectTypesIdFields';

export function getSourceSchema({
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
        const schemaFilePath = path.join(__dirname, '../../schema.graphql');
        typeDefs = fs.readFileSync(schemaFilePath, 'utf8');
    }

    const schema = makeExecutableSchema({ typeDefs });

    //Validations
    validateObjectTypesIdFields(schema.getTypeMap());
    validateQueryType(schema.getQueryType());

    return schema;
}
