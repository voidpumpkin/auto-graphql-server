export function createObjectListData(
    returnTypeName: string,
    listFieldName: string,
    parentTypeName: string
): ListTableData {
    return {
        tableName: `__${returnTypeName}_${listFieldName}_list`,
        childKeyOrValueName: `${returnTypeName}_${listFieldName}_${parentTypeName}_id`,
        parentKeyName: `${returnTypeName}_id`,
    };
}
