import Knex from 'knex';
import { getKnexColumnType } from './graphqlScalarToKnexTypeMap';
import { GRAPHQL_ID } from '../graphqlConstants';

export function buildScalarFieldTables({
    scalarFieldTypeNameMap,
    tableBuilder,
}: {
    scalarFieldTypeNameMap: Record<string, string>;
    tableBuilder: Knex.CreateTableBuilder;
}): void {
    const scalarFieldTypeNameMapEntries = Object.entries(scalarFieldTypeNameMap);
    if (scalarFieldTypeNameMapEntries.length) {
        scalarFieldTypeNameMapEntries.forEach(([fieldName, fieldType]) => {
            if (fieldType === GRAPHQL_ID) {
                tableBuilder.integer(fieldName).unsigned();
                return;
            }
            tableBuilder[getKnexColumnType(fieldType)](fieldName);
        });
    }
}
