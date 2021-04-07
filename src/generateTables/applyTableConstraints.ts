import { isObjectType } from 'graphql';
import Knex from 'knex';
import { TypeMap } from '@graphql-tools/utils';

export async function applyTableConstraints({
    objectTypeNames,
    schemaTypeMap,
    knex,
}: {
    objectTypeNames: string[];
    schemaTypeMap: TypeMap;
    knex: Knex;
}) {
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
}
