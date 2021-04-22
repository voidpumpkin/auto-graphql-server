import Knex from 'knex';
import { getKnexColumnType } from './graphqlScalarToKnexTypeMap';
import { GRAPHQL_ID } from '../graphqlConstants';
import { GraphQLScalarType } from 'graphql';

export function buildScalarFields({
    scalarFieldTypeMap,
    tableBuilder,
}: {
    scalarFieldTypeMap: Record<string, GraphQLScalarType>;
    tableBuilder: Knex.CreateTableBuilder;
}): void {
    const scalarFieldTypeNameMapEntries = Object.entries(scalarFieldTypeMap);
    if (scalarFieldTypeNameMapEntries.length) {
        scalarFieldTypeNameMapEntries.forEach(([fieldName, fieldType]) => {
            if (fieldType.name === GRAPHQL_ID) {
                tableBuilder.integer(fieldName).unsigned();
                return;
            }
            tableBuilder[getKnexColumnType(fieldType.name)](fieldName);
        });
    }
}
