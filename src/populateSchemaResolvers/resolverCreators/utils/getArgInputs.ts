type listInputs = Record<string, all>;
type nonListInputs = Record<string, all>;

export function getArgInputs(
    argObject: Record<string, all>,
    listFields: Record<string, all>,
    nonListFields: Record<string, all>
): [nonListInputs, listInputs] {
    const nonListInputs: Record<string, all> = {};
    const listInputs: Record<string, all> = {};

    for (const inputName in argObject) {
        if (listFields.hasOwnProperty(inputName)) {
            listInputs[inputName] = argObject[inputName] || [];
        } else if (nonListFields.hasOwnProperty(inputName)) {
            nonListInputs[inputName] = argObject[inputName];
        }
    }
    return [nonListInputs, listInputs];
}
