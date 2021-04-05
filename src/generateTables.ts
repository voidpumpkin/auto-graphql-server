import { isScalarType, isObjectType } from 'graphql';

import type Knex from 'knex';
import type { GraphQLSchema } from 'graphql';

import { getKnexColumnType } from './graphqlScalarToKnexTypeMap';

const generateTables = async (sourceSchema: GraphQLSchema, knex: Knex): Promise<void> => {
    const schemaTypeMap = sourceSchema.getTypeMap();
    const objectTypeNames = Object.entries(schemaTypeMap)
        .filter(([key, val]) => isObjectType(val) && key.substr(0, 2) !== '__')
        .map(([key]) => key);

    await Promise.all(
        objectTypeNames.map(async (objectTypeName) => {
            const objectType = schemaTypeMap[objectTypeName];
            if (!isObjectType(objectType)) {
                throw new Error('Not object type');
            }
            const scalarFieldTyples: [string, string][] = [];
            for (const [key, val] of Object.entries(objectType.getFields())) {
                if (isScalarType(val.type)) {
                    scalarFieldTyples.push([key, val.type.name]);
                }
            }
            if (!scalarFieldTyples.length) {
                return;
            }
            if (await knex.schema.hasTable(objectTypeName)) {
                return;
            }
            await knex.schema.createTable(objectTypeName, (tableBuilder) => {
                tableBuilder.increments('id');
                scalarFieldTyples.forEach(([fieldName, fieldType]) =>
                    tableBuilder[getKnexColumnType(fieldType)](fieldName)
                );
            });
        })
    );
};

export default generateTables;
