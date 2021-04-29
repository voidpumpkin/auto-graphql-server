import { DirectiveNode } from 'graphql';
import { getParentFieldValue } from '../../../directives/getParentFieldValue';

export function createParentListData(
    parentListDirective: DirectiveNode,
    parentTypeName: string,
    returnTypeName: string
): ListTableData {
    const parentFieldArgValue = getParentFieldValue(parentListDirective);
    const tableName = `__${parentTypeName}_${parentFieldArgValue}_list`;
    const childKeyOrValueName = `${parentTypeName}_${parentFieldArgValue}_${returnTypeName}_id`;
    const parentKeyName = `${parentTypeName}_id`;
    return {
        tableName,
        childKeyOrValueName,
        parentKeyName,
    };
}
