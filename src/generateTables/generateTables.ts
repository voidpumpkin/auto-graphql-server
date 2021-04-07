import { isObjectType } from 'graphql';

import type Knex from 'knex';
import type { GraphQLSchema } from 'graphql';

import { generateColumns } from './generateColumns';
import { applyTableConstraints } from './applyTableConstraints';

export async function generateTables({
    sourceSchema,
    knex,
}: {
    sourceSchema: GraphQLSchema;
    knex: Knex;
}): Promise<void> {
    const schemaTypeMap = sourceSchema.getTypeMap();
    const objectTypeNames = Object.entries(schemaTypeMap)
        .filter(([key, val]) => isObjectType(val) && key.substr(0, 2) !== '__')
        .map(([key]) => key);

    await generateColumns({ objectTypeNames, knex, schemaTypeMap });
    await applyTableConstraints({ objectTypeNames, schemaTypeMap, knex });
}
