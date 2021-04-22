import {
    isScalarType,
    isObjectType,
    isListType,
    GraphQLList,
    GraphQLObjectType,
    GraphQLScalarType,
} from 'graphql';
import Knex from 'knex';
import { TypeMap } from '@graphql-tools/utils';

import { buildObjectFields } from './buildObjectFields';
import { buildScalarFields } from './buildScalarFields';
import { recursivelyGetAllFieldTypeEntries } from './recursivelyGetAllFieldTypeEntries';
import { updateForeignKeyConstraints } from './updateForeignKeyConstraints';
import { buildListScalarFieldTables } from './buildListScalarFieldTables';

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
        const scalarFieldTypeMap: Record<string, GraphQLScalarType> = {};
        const objectFieldTypeMap: Record<string, GraphQLObjectType> = {};
        const listScalarFieldTypeMap: Record<string, GraphQLScalarType> = {};
        const listObjectFieldTypeMap: Record<string, GraphQLObjectType> = {};

        for (const [key, type] of fieldTypeEntries) {
            if (isScalarType(type) && key !== 'id') {
                scalarFieldTypeMap[key] = type;
            } else if (isObjectType(type)) {
                objectFieldTypeMap[key] = type;
            } else if (isListType(type)) {
                if (isScalarType(type.ofType)) {
                    listScalarFieldTypeMap[key] = type.ofType;
                } else if (isObjectType(type.ofType)) {
                    listObjectFieldTypeMap[key] = type.ofType;
                }
            }
        }
        return {
            scalarFieldTypeMap,
            objectFieldTypeMap,
            listScalarFieldTypeMap,
            listObjectFieldTypeMap,
            objectType,
        };
    });

    await Promise.all(
        prepedDataList.map(
            async ({
                scalarFieldTypeMap,
                objectFieldTypeMap,
                listScalarFieldTypeMap,
                objectType,
            }) => {
                if (
                    !!Object.keys(scalarFieldTypeMap).length &&
                    !!Object.keys(objectFieldTypeMap).length &&
                    !!Object.keys(listScalarFieldTypeMap).length
                ) {
                    return;
                }
                await knex.schema.createTable(objectType.name, (tableBuilder) => {
                    tableBuilder.increments('id').unsigned();
                    buildScalarFields({ scalarFieldTypeMap, tableBuilder });
                    buildObjectFields({ objectFieldTypeMap, tableBuilder });
                });
                await buildListScalarFieldTables(listScalarFieldTypeMap, objectType, knex);
            }
        )
    );

    await Promise.all(
        prepedDataList.map(
            async ({
                objectFieldTypeMap,
                listScalarFieldTypeMap,
                listObjectFieldTypeMap,
                objectType,
            }) => {
                if (
                    !!Object.keys(objectFieldTypeMap).length &&
                    !!Object.keys(listScalarFieldTypeMap).length &&
                    !!Object.keys(listObjectFieldTypeMap).length
                ) {
                    return;
                }
                await updateForeignKeyConstraints({
                    objectFieldTypeMap,
                    listScalarFieldTypeMap,
                    listObjectFieldTypeMap,
                    objectType,
                    knex,
                });
            }
        )
    );
}
