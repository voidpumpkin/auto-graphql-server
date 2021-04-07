import { isScalarType, isObjectType } from 'graphql';

import type Knex from 'knex';
import type { GraphQLSchema } from 'graphql';

import { getKnexColumnType } from './graphqlScalarToKnexTypeMap';
import { GRAPHQL_ID } from './constants';

const generateTables = async (sourceSchema: GraphQLSchema, knex: Knex): Promise<void> => {
    const schemaTypeMap = sourceSchema.getTypeMap();
    const objectTypeNames = Object.entries(schemaTypeMap)
        .filter(([key, val]) => isObjectType(val) && key.substr(0, 2) !== '__')
        .map(([key]) => key);

    await Promise.all(
        objectTypeNames.map(async (objectTypeName) => {
            if (await knex.schema.hasTable(objectTypeName)) {
                return;
            }
            const objectType = schemaTypeMap[objectTypeName];
            if (!isObjectType(objectType)) {
                throw new Error('Not object type');
            }
            const scalarFieldTypes: [string, string][] = [];
            const objectFieldNames: string[] = [];
            for (const [key, val] of Object.entries(objectType.getFields())) {
                if (isScalarType(val.type)) {
                    scalarFieldTypes.push([key, val.type.name]);
                } else if (isObjectType(val.type)) {
                    objectFieldNames.push(key);
                }
            }
            if (!!scalarFieldTypes.length && !!objectFieldNames.length) {
                return;
            }
            await knex.schema.createTable(objectTypeName, (tableBuilder) => {
                tableBuilder.integer('id').unsigned();
                if (scalarFieldTypes.length) {
                    scalarFieldTypes.forEach(([fieldName, fieldType]) => {
                        if (fieldType === GRAPHQL_ID) {
                            tableBuilder.integer(fieldName).unsigned();
                            return;
                        }
                        tableBuilder[getKnexColumnType(fieldType)](fieldName);
                    });
                }
                if (objectFieldNames.length) {
                    objectFieldNames.forEach((fieldName) =>
                        tableBuilder.integer(fieldName).unsigned()
                    );
                }
            });
        })
    );
    await Promise.all(
        objectTypeNames.map(async (objectTypeName) => {
            const objectType = schemaTypeMap[objectTypeName];
            if (!isObjectType(objectType)) {
                throw new Error('Not object type');
            }
            const objectFieldTypes: [string, string][] = [];
            for (const [key, val] of Object.entries(objectType.getFields())) {
                if (isObjectType(val.type)) {
                    objectFieldTypes.push([key, val.type.name]);
                }
            }
            if (!!objectFieldTypes.length) {
                return;
            }
            await knex.schema.alterTable(objectTypeName, (table) => {
                objectFieldTypes.forEach(([fieldName, fieldType]) =>
                    table.foreign(fieldName).references(`${fieldType}.id`)
                );
            });
        })
    );
};

export default generateTables;
