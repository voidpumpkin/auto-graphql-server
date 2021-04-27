export const NO_TABLE = 'NoTable' as const;

export const DIRECTIVE_DEFINITION_MAP = {
    [NO_TABLE]: `directive @${NO_TABLE} on OBJECT | FIELD_DEFINITION` as const,
};
