import { GraphQLObjectType } from 'graphql';
import Knex from 'knex';

export function buildObjectFields({
    objectFieldTypeMap,
    tableBuilder,
}: {
    objectFieldTypeMap: Record<string, GraphQLObjectType>;
    tableBuilder: Knex.CreateTableBuilder;
}): void {
    Object.keys(objectFieldTypeMap).forEach((name) => tableBuilder.integer(name).unsigned());
}
