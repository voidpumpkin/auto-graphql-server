export function createScalarListData(returnTypeName: string, inputName: string): ListTableData {
    return {
        tableName: `__${returnTypeName}_${inputName}_list`,
        childKeyOrValueName: 'value',
        parentKeyName: `${returnTypeName}_id`,
    };
}
