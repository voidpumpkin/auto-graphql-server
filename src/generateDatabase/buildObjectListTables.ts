import { GraphQLID, GraphQLObjectType } from 'graphql';
import Knex from 'knex';
import { buildScalarListField } from './buildScalarListField';

export async function buildObjectListTables(
    listObjectFieldTypeMap: Record<string, GraphQLObjectType>,
    objectType: GraphQLObjectType,
    knex: Knex
): Promise<void> {
    await Promise.all(
        Object.entries(listObjectFieldTypeMap).map(
            async ([name, listType]) =>
                await buildScalarListField(
                    GraphQLID,
                    objectType.name,
                    name,
                    knex,
                    `${objectType.name}_${name}_${listType.name}_id`,
                    `${objectType.name}_id`
                )
        )
    );
}
