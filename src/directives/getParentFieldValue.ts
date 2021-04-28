import { DirectiveNode } from 'graphql';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getParentFieldValue(parentListDirective: DirectiveNode): any {
    const parentFieldArg = parentListDirective?.arguments?.filter(
        (a) => a.name.value === 'parentField'
    )[0];
    const parentFieldArgValue =
        parentFieldArg && 'value' in parentFieldArg?.value ? parentFieldArg.value.value : undefined;
    return parentFieldArgValue;
}
