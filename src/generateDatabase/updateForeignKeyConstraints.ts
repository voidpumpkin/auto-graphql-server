import { GraphQLObjectType, GraphQLScalarType } from 'graphql';
import Knex from 'knex';

export async function updateForeignKeyConstraints({
    objectFieldTypeMap,
    listScalarFieldTypeMap,
    listObjectFieldTypeMap,
    objectType,
    knex,
}: {
    objectFieldTypeMap: Record<string, GraphQLObjectType>;
    listScalarFieldTypeMap: Record<string, GraphQLScalarType>;
    listObjectFieldTypeMap: Record<string, GraphQLObjectType>;
    objectType: GraphQLObjectType;
    knex: Knex;
}): Promise<void> {
    await Promise.all(
        Object.entries(objectFieldTypeMap).map(async ([name, type]) => {
            await knex.schema.alterTable(objectType.name, (tableBuilder) => {
                tableBuilder.foreign(name).references(`${type.name}.id`);
            });
        })
    );
    await Promise.all(
        Object.keys(listScalarFieldTypeMap).map(async (name) => {
            const foreignKey = `${objectType.name}_id`;
            const tableName = `__${objectType.name}_${name}_list`;
            await knex.schema.alterTable(tableName, (table) => {
                table.foreign(foreignKey).references(`${objectType.name}.id`);
            });
        })
    );
    await Promise.all(
        Object.entries(listObjectFieldTypeMap).map(async ([name, type]) => {
            const parentForeignKey = `${objectType.name}_id`;
            const listTypeIdForeignKey = `${objectType.name}_${name}_${type.name}_id`;
            const tableName = `__${objectType.name}_${name}_list`;
            await knex.schema.alterTable(tableName, (table) => {
                table.foreign(listTypeIdForeignKey).references(`${type.name}.id`);
                table.foreign(parentForeignKey).references(`${objectType.name}.id`);
            });
        })
    );
}
