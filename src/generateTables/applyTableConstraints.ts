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
}): Promise<void> {
    await Promise.all(
        objectTypeNames.map(async (objectTypeName) => {
            const objectType = schemaTypeMap[objectTypeName];
            if (!isObjectType(objectType)) {
                throw Error('Not object type');
            }

            const directFieldEntries = Object.entries(objectType.getFields());
            const interfacesFieldEntries = objectType
                .getInterfaces()
                .map((i) => Object.entries(i.getFields()))
                .flat();
            const fieldEntries = [...directFieldEntries, ...interfacesFieldEntries];

            const objectFieldTypes: [string, string][] = [];
            for (const [key, val] of fieldEntries) {
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
