import { isScalarType, isObjectType, isListType, GraphQLList } from 'graphql';
import Knex from 'knex';
import { TypeMap } from '@graphql-tools/utils';

import { buildObjectFieldTables } from './buildObjectFieldTables';
import { buildScalarFieldTables } from './buildScalarFieldTables';
import { buildListFields } from './buildListFields';
import { recursivelyGetAllFieldTypeEntries } from './recursivelyGetAllFieldTypeEntries';
import { GRAPHQL_ID } from './constants';

export async function generateColumns({
    objectTypeNames,
    knex,
    schemaTypeMap,
}: {
    objectTypeNames: string[];
    knex: Knex;
    schemaTypeMap: TypeMap;
}): Promise<void> {
    await Promise.all(
        objectTypeNames.map(async (objectTypeName) => {
            let tableBuildMethod: 'alterTable' | 'createTable' = 'createTable';
            if (await knex.schema.hasTable(objectTypeName)) {
                tableBuildMethod = 'alterTable';
            }
            const objectType = schemaTypeMap[objectTypeName];
            if (!isObjectType(objectType)) {
                throw new Error('Not object type');
            }

            const fieldTypeEntries = recursivelyGetAllFieldTypeEntries(objectType);

            const scalarFieldTypeNameMap: Record<string, string> = {};
            const objectFieldNames: string[] = [];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const listFieldTypeMap: Record<string, GraphQLList<any>> = {};
            for (const [key, type] of fieldTypeEntries) {
                if (isScalarType(type)) {
                    if (key === 'id') {
                        if (type?.name !== GRAPHQL_ID) {
                            throw new Error(`'id' field can only be ID type`);
                        }
                    } else {
                        scalarFieldTypeNameMap[key] = type.name;
                    }
                } else if (isObjectType(type)) {
                    objectFieldNames.push(key);
                } else if (isListType(type)) {
                    listFieldTypeMap[key] = type.ofType;
                }
            }
            if (
                !!Object.keys(scalarFieldTypeNameMap).length &&
                !!objectFieldNames.length &&
                !!Object.keys(listFieldTypeMap).length
            ) {
                return;
            }
            await knex.schema[tableBuildMethod](objectTypeName, (tableBuilder) => {
                tableBuilder.increments('id').unsigned();
                buildScalarFieldTables({ scalarFieldTypeNameMap, tableBuilder });
                buildObjectFieldTables({ objectFieldNames, tableBuilder });
            });
            await buildListFields({ listFieldTypeMap, objectTypeName, knex });
        })
    );
}
