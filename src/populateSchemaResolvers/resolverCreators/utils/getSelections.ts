import { isListType, GraphQLFieldMap } from 'graphql';

export function getSelections(
    info: AnyRecord,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resultTypeFields: GraphQLFieldMap<any, any>
): string[] {
    let selections: string[] =
        info.fieldNodes[0].selectionSet?.selections.map(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            (selectionNode) => selectionNode.name.value
        ) || [];
    for (const selection of selections) {
        if (isListType(resultTypeFields[selection].type)) {
            selections = [];
            break;
        }
    }
    return selections;
}
