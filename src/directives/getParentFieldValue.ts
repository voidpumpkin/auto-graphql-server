import { DirectiveNode } from 'graphql';

export function getParentFieldValue(parentListDirective: DirectiveNode): all {
    const parentFieldArg = parentListDirective?.arguments?.filter(
        (a) => a.name.value === 'parentField'
    )[0];
    const parentFieldArgValue =
        parentFieldArg && 'value' in parentFieldArg?.value ? parentFieldArg.value.value : undefined;
    return parentFieldArgValue;
}
