import {
    isScalarType,
    isObjectType,
    isListType,
    GraphQLObjectType,
    GraphQLScalarType,
} from 'graphql';
import Knex from 'knex';

import { buildObjectFields } from './buildObjectFields';
import { buildScalarFields } from './buildScalarFields';
import { recursivelyGetAllFields } from './recursivelyGetAllFields';
import { updateForeignKeyConstraints } from './updateForeignKeyConstraints';
import { buildScalarListTables } from './buildScalarListTables';
import { buildObjectListTables } from './buildObjectListTables';
import { NO_TABLE, PARENTS_LIST } from '../directives/directives';

export async function generateTables({
    objectTypes,
    knex,
}: {
    objectTypes: GraphQLObjectType[];
    knex: Knex;
}): Promise<void> {
    const prepedDataList = objectTypes.map((objectType) => {
        const fieldTypes = recursivelyGetAllFields({ type: objectType });
        const scalarFieldTypeMap: Record<string, GraphQLScalarType> = {};
        const objectFieldTypeMap: Record<string, GraphQLObjectType> = {};
        const listScalarFieldTypeMap: Record<string, GraphQLScalarType> = {};
        const listObjectFieldTypeMap: Record<string, GraphQLObjectType> = {};

        for (const { name, type, astNode } of fieldTypes) {
            if (isScalarType(type) && name !== 'id') {
                scalarFieldTypeMap[name] = type;
            } else if (isObjectType(type)) {
                objectFieldTypeMap[name] = type;
            } else if (isListType(type)) {
                if (isScalarType(type.ofType)) {
                    listScalarFieldTypeMap[name] = type.ofType;
                } else if (isObjectType(type.ofType)) {
                    if (
                        !astNode?.directives?.some((d) =>
                            ([NO_TABLE, PARENTS_LIST] as string[]).includes(d.name.value)
                        )
                    ) {
                        listObjectFieldTypeMap[name] = type.ofType;
                    }
                }
            }
        }
        return {
            scalarFieldTypeMap,
            objectFieldTypeMap,
            listObjectFieldTypeMap,
            listScalarFieldTypeMap,
            objectType,
        };
    });

    await Promise.all(
        prepedDataList.map(
            async ({
                scalarFieldTypeMap,
                objectFieldTypeMap,
                listScalarFieldTypeMap,
                listObjectFieldTypeMap,
                objectType,
            }) => {
                if (
                    !!Object.keys(scalarFieldTypeMap).length &&
                    !!Object.keys(objectFieldTypeMap).length &&
                    !!Object.keys(listScalarFieldTypeMap).length &&
                    !!Object.keys(listObjectFieldTypeMap).length
                ) {
                    return;
                }
                await knex.schema.createTable(objectType.name, (tableBuilder) => {
                    tableBuilder.increments('id').unsigned();
                    buildScalarFields({ scalarFieldTypeMap, tableBuilder });
                    buildObjectFields({ objectFieldTypeMap, tableBuilder });
                });
                await buildScalarListTables(listScalarFieldTypeMap, objectType, knex);
                await buildObjectListTables(listObjectFieldTypeMap, objectType, knex);
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
                    !!Object.keys(listScalarFieldTypeMap).length
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
