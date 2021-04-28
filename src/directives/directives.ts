export const NO_TABLE = 'NoTable' as const;
export const NO_CHILD_TO_PARENT_LINK = 'NoChildToParentLink' as const;
export const PARENTS_LIST = 'ParentsList' as const;

export type Directive = typeof NO_TABLE | typeof NO_CHILD_TO_PARENT_LINK | typeof PARENTS_LIST;

export const DIRECTIVE_DEFINITION_MAP = {
    [NO_TABLE]: `directive @${NO_TABLE} on OBJECT | FIELD_DEFINITION` as const,
    [NO_CHILD_TO_PARENT_LINK]: `directive @${NO_CHILD_TO_PARENT_LINK} on FIELD_DEFINITION` as const,
    [PARENTS_LIST]: `directive @${PARENTS_LIST}(parentField: String) on FIELD_DEFINITION | INPUT_FIELD_DEFINITION` as const,
};
