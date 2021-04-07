import { isObjectType, GraphQLList } from 'graphql';
import Knex from 'knex';

export async function buildObjectScalarField(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listType: GraphQLList<any>,
    knex: Knex,
    objectTypeName: string,
    foreignKey: string
): Promise<void> {
    if (isObjectType(listType)) {
        let objectTableBuildMethod: 'alterTable' | 'createTable' = 'createTable';
        if (await knex.schema.hasTable(objectTypeName)) {
            objectTableBuildMethod = 'alterTable';
        }
        await knex.schema[objectTableBuildMethod](listType.name, (tableBuilder) => {
            tableBuilder.integer(foreignKey).unsigned();
            tableBuilder.foreign(foreignKey).references(`${objectTypeName}.id`);
        });
    }
}
