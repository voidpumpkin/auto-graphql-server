import { FieldDefinitionNode } from 'graphql';

export function hasDirectives(
    astNode: FieldDefinitionNode | undefined | null,
    directives: string[]
): boolean {
    return astNode?.directives?.some((d) => directives.includes(d.name.value)) || false;
}
