import { isScalarType, isObjectType, GraphQLList, GraphQLObjectType } from 'graphql';
import Knex from 'knex';

export async function updateListFields(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listFieldTypeMap: Record<string, GraphQLList<any>>,
    objectType: GraphQLObjectType,
    knex: Knex
): Promise<void> {
    await Promise.all(
        Object.entries(listFieldTypeMap).map(async ([name, listType]) => {
            const foreignKey = `${objectType.name}_${name}_id`;
            if (isScalarType(listType)) {
                const tableName = `__${objectType.name}_${name}_list`;
                await knex.schema.alterTable(tableName, (table) => {
                    table.foreign(foreignKey).references(`${objectType.name}.id`);
                });
            } else if (isObjectType(listType)) {
                await knex.schema.alterTable(listType.name, (tableBuilder) => {
                    tableBuilder.foreign(foreignKey).references(`${objectType.name}.id`);
                });
            }
        })
    );
}
