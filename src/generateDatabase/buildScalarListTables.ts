import { GraphQLObjectType, GraphQLScalarType } from 'graphql';
import Knex from 'knex';
import { buildScalarListField } from './buildScalarListField';

export async function buildScalarListTables(
    listScalarFieldTypeMap: Record<string, GraphQLScalarType>,
    objectType: GraphQLObjectType,
    knex: Knex
): Promise<void> {
    await Promise.all(
        Object.entries(listScalarFieldTypeMap).map(
            async ([name, listType]) =>
                await buildScalarListField(listType, objectType.name, name, knex)
        )
    );
}
