import { GraphQLScalarType, GraphQLID } from 'graphql';
import Knex from 'knex';
import { buildScalarFields } from './buildScalarFields';

export async function buildScalarListField(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listType: GraphQLScalarType,
    objectTypeName: string,
    name: string,
    knex: Knex,
    valueFieldName = 'value',
    parentKeyName = `${objectTypeName}_${name}_id`
): Promise<void> {
    const tableName = `__${objectTypeName}_${name}_list`;
    await knex.schema.createTable(tableName, (tableBuilder) => {
        tableBuilder.increments('id').unsigned();
        buildScalarFields({
            scalarFieldTypeMap: {
                [valueFieldName]: listType,
                [parentKeyName]: GraphQLID,
            },
            tableBuilder,
        });
    });
}
