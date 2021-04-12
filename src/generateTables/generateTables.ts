import type Knex from 'knex';
import { GraphQLSchema, isObjectType } from 'graphql';

import { generateColumns } from './generateColumns';
import { applyTableConstraints } from './applyTableConstraints';

export async function generateTables({
    sourceSchema,
    knex,
    skipDbCreationIfExists,
}: {
    sourceSchema: GraphQLSchema;
    knex: Knex;
    skipDbCreationIfExists?: boolean;
}): Promise<void> {
    const schemaTypeMap = sourceSchema.getTypeMap();
    const objectTypeNames = Object.entries(schemaTypeMap)
        .filter(([key, val]) => isObjectType(val) && key.substr(0, 2) !== '__')
        .map(([key]) => key);

    if (skipDbCreationIfExists && (await knex.schema.hasTable(objectTypeNames[0]))) {
        (await import('../logger')).log(
            '💀💀💀',
            '\x1b[1m\x1b[31mSKIPPED TABLE CREATION, DB ALREADY EXISTS'
        );
        return;
    }

    await generateColumns({ objectTypeNames, knex, schemaTypeMap });
    await applyTableConstraints({ objectTypeNames, schemaTypeMap, knex });
}
