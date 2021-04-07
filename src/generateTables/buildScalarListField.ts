import { isScalarType, GraphQLList } from 'graphql';
import Knex from 'knex';
import { GRAPHQL_ID } from './constants';
import { buildScalarFieldTables } from './buildScalarFieldTables';

export async function buildScalarListField(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listType: GraphQLList<any>,
    objectTypeName: string,
    name: string,
    knex: Knex,
    foreignKey: string
): Promise<void> {
    if (!isScalarType(listType)) {
        return;
    }
    const tableName = `__${objectTypeName}_${name}_list`;
    await knex.schema.createTable(tableName, (tableBuilder) => {
        tableBuilder.increments('id').unsigned();
        buildScalarFieldTables({
            scalarFieldTypeNameMap: {
                value: listType.name,
                [foreignKey]: GRAPHQL_ID,
            },
            tableBuilder,
        });
    });
    await knex.schema.alterTable(tableName, (table) => {
        table.foreign(foreignKey).references(`${objectTypeName}.id`);
    });
}
