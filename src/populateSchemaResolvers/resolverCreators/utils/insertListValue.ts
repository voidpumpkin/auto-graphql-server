import Knex from 'knex';

export async function insertListValue(
    listData: ListTableData,
    knex: Knex,
    valueOrChildId: all,
    parentId: number | string
): Promise<void> {
    const {
        tableName,
        childKeyOrValueName: childForeignKeyName,
        parentKeyName: parentForeignKey,
    } = listData;
    await knex(tableName).insert({
        [childForeignKeyName]: valueOrChildId,
        [parentForeignKey]: parentId,
    });
}
