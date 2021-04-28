import { isScalarType, GraphQLObjectType, isListType } from 'graphql';
import { NO_TABLE, PARENTS_LIST } from '../../../directives/directives';
import { getParentFieldValue } from '../../../directives/getParentFieldValue';
import { getParentListDirective } from '../../../directives/getParentListDirective';
import { GRAPHQL_ID } from '../../../utils/graphqlConstants';
import { toSentenceCase } from '../../../utils/toSentenceCase';

export const defaultInputArg: ArgData = {
    name: 'input',
    typeNameEnding: 'Input',
};
const defaultFilterArg: ArgData = {
    name: 'filter',
    typeNameEnding: 'FilterInput',
    disAllowListFields: true,
};

const defaultMutationData = {
    add: { args: [defaultInputArg] },
    update: { args: [defaultFilterArg, defaultInputArg], returnsList: true },
    remove: { args: [defaultFilterArg], returnsList: true, returnType: GRAPHQL_ID },
};

type ArgData = {
    name: string;
    typeNameEnding: string;
    disAllowListFields?: boolean;
};

type MutationData = {
    args: ArgData[];
    returnsList?: boolean;
    returnType?: string;
};

export function getMutationStrings(
    namedType: GraphQLObjectType,
    mutationsData: Record<string, MutationData> = defaultMutationData
): { rootMutationFields: string; inputTypes: string } {
    let rootMutationFields = '';
    let inputTypes = '';

    let mutationNonListFields = '';
    let mutationListFields = '';
    Object.values(namedType.getFields()).forEach(({ name, type, astNode }) => {
        if (isScalarType(type)) {
            mutationNonListFields += `${name}: ${type.name} `;
        } else if (isListType(type)) {
            const ofType = type.ofType;
            const parentListDirective = getParentListDirective(astNode);
            if (isScalarType(ofType)) {
                mutationListFields += `${name}: [${ofType.name}] `;
            } else if (parentListDirective) {
                const parentFieldArgValue = getParentFieldValue(parentListDirective);
                mutationListFields += `${name}: [${GRAPHQL_ID}] @${PARENTS_LIST}(parentField: "${parentFieldArgValue}") `;
            } else if (!astNode?.directives?.some((d) => d.name.value === NO_TABLE)) {
                mutationListFields += `${name}: [${GRAPHQL_ID}] `;
            }
        } else {
            mutationNonListFields += `${name}: ${GRAPHQL_ID} `;
        }
    });

    Object.entries(mutationsData).forEach(([mutationMethod, { args, returnsList, returnType }]) => {
        const isValid = args.reduce((acc, { disAllowListFields }) => {
            if (disAllowListFields && !mutationNonListFields) {
                return false;
            } else if (!disAllowListFields && !mutationNonListFields && !mutationListFields) {
                return false;
            }
            return acc && true;
        }, true);
        if (!isValid) {
            return;
        }
        const mutationName = `${mutationMethod}${namedType.name}`;
        const argStrings = args.map(
            ({ name, typeNameEnding }) =>
                `${name}: ${toSentenceCase(mutationName)}${typeNameEnding}`
        );
        const returnLowerType = returnType ? 'ID' : namedType.name;
        const returnFinalType = returnsList ? `[${returnLowerType}]` : returnLowerType;
        rootMutationFields += `${mutationName}(${argStrings.join(' , ')}): ${returnFinalType} `;

        const argsInputTypes = args.reduce((prev, { typeNameEnding, disAllowListFields }) => {
            const fields = disAllowListFields
                ? mutationNonListFields
                : `${mutationNonListFields} ${mutationListFields}`;
            return `${prev}input ${
                mutationName[0].toUpperCase() + mutationName.slice(1)
            }${typeNameEnding} {${fields}} `;
        }, '');
        inputTypes += argsInputTypes;
    });

    return { rootMutationFields, inputTypes };
}
