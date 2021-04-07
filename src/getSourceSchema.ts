import fs from 'fs';
import path from 'path';
import { makeExecutableSchema } from '@graphql-tools/schema';

import type { GraphQLSchema } from 'graphql';

export function getSourceSchema({
    schemaPath,
    typeDefs,
}: {
    schemaPath?: string;
    typeDefs?: string;
}): GraphQLSchema {
    if (!typeDefs) {
        if (!schemaPath) {
            throw new Error('TypeDefs or SchemaPath required');
        }
        const schemaFilePath = path.join(__dirname, '../schema.graphql');
        typeDefs = fs.readFileSync(schemaFilePath, 'utf8');
    }

    const schema = makeExecutableSchema({ typeDefs });
    return schema;
}
