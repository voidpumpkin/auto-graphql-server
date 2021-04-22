import { GraphQLScalarType, GraphQLID } from 'graphql';
import Knex from 'knex';
import { buildScalarFields } from './buildScalarFields';

export async function buildScalarListField(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listType: GraphQLScalarType,
    objectTypeName: string,
    name: string,
    knex: Knex
): Promise<void> {
    const foreignKey = `${objectTypeName}_${name}_id`;
    const tableName = `__${objectTypeName}_${name}_list`;
    await knex.schema.createTable(tableName, (tableBuilder) => {
        tableBuilder.increments('id').unsigned();
        buildScalarFields({
            scalarFieldTypeMap: {
                value: listType,
                [foreignKey]: GraphQLID,
            },
            tableBuilder,
        });
    });
}
