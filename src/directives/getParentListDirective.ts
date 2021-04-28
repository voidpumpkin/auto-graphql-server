import { DirectiveNode, FieldDefinitionNode } from 'graphql';
import { PARENTS_LIST } from './directives';

export function getParentListDirective(
    astNode: FieldDefinitionNode | undefined | null
): DirectiveNode | undefined {
    return astNode?.directives?.filter((d) => d.name.value === PARENTS_LIST)[0];
}
