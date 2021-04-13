import Knex from 'knex';

export function buildObjectFieldTables({
    objectFieldNames,
    tableBuilder,
}: {
    objectFieldNames: string[];
    tableBuilder: Knex.CreateTableBuilder;
}): void {
    if (objectFieldNames.length) {
        objectFieldNames.forEach((fieldName) => tableBuilder.integer(fieldName).unsigned());
    }
}
