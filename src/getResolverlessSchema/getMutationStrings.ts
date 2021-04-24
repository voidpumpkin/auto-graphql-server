import { isScalarType, GraphQLObjectType, isListType } from 'graphql';
import { toSentenceCase } from './toSentenceCase';

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
    remove: { args: [defaultFilterArg], returnsList: true },
};

type ArgData = {
    name: string;
    typeNameEnding: string;
    disAllowListFields?: boolean;
};

type MutationData = {
    args: ArgData[];
    returnsList?: boolean;
};

export function getMutationStrings(
    namedType: GraphQLObjectType,
    mutationsData: Record<string, MutationData> = defaultMutationData
): { rootMutationFields: string; inputTypes: string } {
    let rootMutationFields = '';
    let inputTypes = '';

    let mutationNonListFields = '';
    let mutationListFields = '';
    Object.values(namedType.getFields()).forEach(({ name, type }) => {
        if (isScalarType(type)) {
            mutationNonListFields += `${name}: ${type.name} `;
        } else if (isListType(type)) {
            const ofType = type.ofType;
            if (isScalarType(ofType)) {
                mutationListFields += `${name}: [${ofType.name}] `;
            } else {
                mutationListFields += `${name}: [ID] `;
            }
        } else {
            mutationNonListFields += `${name}: ID `;
        }
    });

    Object.entries(mutationsData).forEach(([mutationMethod, { args, returnsList }]) => {
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
        const returnType = returnsList ? `[${namedType.name}]` : namedType.name;
        rootMutationFields += `${mutationName}(${argStrings.join(' , ')}): ${returnType} `;

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
