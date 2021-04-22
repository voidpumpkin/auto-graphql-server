import { isScalarType, isObjectType, isListType, GraphQLList } from 'graphql';
import Knex from 'knex';
import { TypeMap } from '@graphql-tools/utils';

import { buildObjectFieldTables } from './buildObjectFieldTables';
import { buildScalarFieldTables } from './buildScalarFieldTables';
import { buildListFields } from './buildListFields';
import { recursivelyGetAllFieldTypeEntries } from './recursivelyGetAllFieldTypeEntries';
import { updateListFields } from './updateListFields';

export async function generateTables({
    objectTypeNames,
    knex,
    schemaTypeMap,
}: {
    objectTypeNames: string[];
    knex: Knex;
    schemaTypeMap: TypeMap;
}): Promise<void> {
    const prepedDataList = objectTypeNames.map((objectTypeName) => {
        const objectType = schemaTypeMap[objectTypeName];
        if (!isObjectType(objectType)) {
            throw Error('Not object type');
        }
        const fieldTypeEntries = recursivelyGetAllFieldTypeEntries(objectType);
        const scalarFieldTypeNameMap: Record<string, string> = {};
        const objectFieldNames: string[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const listFieldTypeMap: Record<string, GraphQLList<any>> = {};
        for (const [key, type] of fieldTypeEntries) {
            if (isScalarType(type) && key !== 'id') {
                scalarFieldTypeNameMap[key] = type.name;
            } else if (isObjectType(type)) {
                objectFieldNames.push(key);
            } else if (isListType(type)) {
                listFieldTypeMap[key] = type.ofType;
            }
        }
        return {
            listFieldTypeMap,
            scalarFieldTypeNameMap,
            objectFieldNames,
            objectType,
        };
    });

    await Promise.all(
        prepedDataList.map(
            async ({ listFieldTypeMap, scalarFieldTypeNameMap, objectFieldNames, objectType }) => {
                let tableBuildMethod: 'alterTable' | 'createTable' = 'createTable';
                if (await knex.schema.hasTable(objectType.name)) {
                    tableBuildMethod = 'alterTable';
                }
                if (
                    !!Object.keys(scalarFieldTypeNameMap).length &&
                    !!objectFieldNames.length &&
                    !!Object.keys(listFieldTypeMap).length
                ) {
                    return;
                }
                await knex.schema[tableBuildMethod](objectType.name, (tableBuilder) => {
                    tableBuilder.increments('id').unsigned();
                    buildScalarFieldTables({ scalarFieldTypeNameMap, tableBuilder });
                    buildObjectFieldTables({ objectFieldNames, tableBuilder });
                });
                await buildListFields({ listFieldTypeMap, objectTypeName: objectType.name, knex });
            }
        )
    );

    await Promise.all(
        prepedDataList.map(
            async ({ listFieldTypeMap, scalarFieldTypeNameMap, objectFieldNames, objectType }) => {
                if (
                    !!Object.keys(scalarFieldTypeNameMap).length &&
                    !!objectFieldNames.length &&
                    !!Object.keys(listFieldTypeMap).length
                ) {
                    return;
                }
                await updateListFields(listFieldTypeMap, objectType, knex);
            }
        )
    );
}
