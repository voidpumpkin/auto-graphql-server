type listInputs = AnyRecord;
type nonListInputs = AnyRecord;

export function getArgInputs(
    argObject: AnyRecord,
    listFields: AnyRecord,
    nonListFields: AnyRecord
): [nonListInputs, listInputs] {
    const nonListInputs: AnyRecord = {};
    const listInputs: AnyRecord = {};

    for (const inputName in argObject) {
        if (listFields.hasOwnProperty(inputName)) {
            listInputs[inputName] = argObject[inputName];
        } else if (nonListFields.hasOwnProperty(inputName)) {
            nonListInputs[inputName] = argObject[inputName];
        }
    }
    return [nonListInputs, listInputs];
}
