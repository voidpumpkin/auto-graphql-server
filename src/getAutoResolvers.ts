/* eslint-disable @typescript-eslint/no-explicit-any */
import { isScalarType, isObjectType, isEqualType, isListType, GraphQLObjectType } from 'graphql';

import type Knex from 'knex';
import type { IResolvers } from '@graphql-tools/utils';
import type { GraphQLSchema } from 'graphql';

export function getAutoResolvers({
    sourceSchema,
    knex,
}: {
    sourceSchema: GraphQLSchema;
    knex: Knex;
}): IResolvers {
    const objectTypeResolvers = getObjectTypeResolvers(sourceSchema, knex);
    const mutationResolvers = getMutationResolvers(sourceSchema, knex);
    return { ...objectTypeResolvers, ...mutationResolvers };
}
function getObjectTypeResolvers(sourceSchema: GraphQLSchema, knex: Knex): IResolvers {
    const resolvers: IResolvers = {};
    const schemaTypeMap = sourceSchema.getTypeMap();
    const objectTypesNames = Object.entries(schemaTypeMap)
        .filter(([key, val]) => isObjectType(val) && key.substr(0, 2) !== '__')
        .map(([, val]) => val as GraphQLObjectType);

    objectTypesNames.map((objectType) => {
        //create resolver object
        resolvers[objectType.name] = {};
        //resolvers
        Object.entries(objectType.getFields()).forEach(([fieldName, fieldType]) => {
            const fieldTypeType = fieldType.type;
            if (isListType(fieldTypeType)) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                resolvers[objectType.name][fieldName] = async (root, _, __, info) => {
                    const queryType = info.schema.getQueryType();
                    if (!queryType) {
                        throw Error('QueryType not defined');
                    }
                    if (!root && isEqualType(info.parentType, queryType)) {
                        root = await knex(info.parentType.name).select('*').first();
                        if (!root) {
                            throw Error('Failed to query query');
                        }
                    }
                    const resultType = info.returnType.ofType;

                    if (isScalarType(resultType)) {
                        const knexResult = await knex(
                            `__${info.parentType.name}_${info.fieldName}_list`
                        )
                            .select('value')
                            .where({ [`__${info.parentType.name}_id`]: root.id });
                        return knexResult.map((row) => row.value);
                    }
                    if (isObjectType(resultType)) {
                        let selections: string[] = info.fieldNodes[0].selectionSet.selections.map(
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            //@ts-ignore
                            (selectionNode) => selectionNode.name.value
                        );
                        const resultTypeFields = info.returnType.ofType.getFields();
                        for (const selection of selections) {
                            if (isListType(resultTypeFields[selection].type)) {
                                selections = [];
                                break;
                            }
                        }
                        const result = await knex(info.returnType.ofType.name)
                            .select(...selections)
                            .where({ [`__${info.parentType.name}_id`]: root.id });
                        return result;
                    }
                    throw Error('field return array type is neither object nor scalar');
                };
            }
            if (isObjectType(fieldTypeType)) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                resolvers[objectType.name][fieldName] = async (root, _, __, info) => {
                    const queryType = info.schema.getQueryType();
                    if (!queryType) {
                        throw Error('QueryType not defined');
                    }
                    if (!root && isEqualType(info.parentType, queryType)) {
                        root = await knex(info.parentType.name).select('*').first();
                        if (!root) {
                            throw Error('Failed to query query');
                        }
                    }
                    let selections: string[] = info.fieldNodes[0].selectionSet.selections.map(
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        //@ts-ignore
                        (selectionNode) => selectionNode.name.value
                    );
                    const resultTypeFields = info.returnType.getFields();
                    for (const selection of selections) {
                        if (isListType(resultTypeFields[selection].type)) {
                            selections = [];
                            break;
                        }
                    }
                    const result = await knex(info.returnType.name)
                        .select(...selections)
                        .where({ id: root[info.fieldName] });
                    if (result.length > 1) {
                        throw Error('More than one found');
                    }
                    return result[0];
                };
            }
            if (isScalarType(fieldTypeType)) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                resolvers[objectType.name][fieldName] = async (root, _, __, info) => {
                    if (root?.hasOwnProperty(info.fieldName)) {
                        return root[info.fieldName];
                    }
                    const result = await knex
                        .select(info.fieldName)
                        .table(info.parentType.name)
                        .first();
                    return result[info.fieldName];
                };
            }
        });
    });
    return resolvers;
}
function getMutationResolvers(sourceSchema: GraphQLSchema, knex: Knex): IResolvers {
    const resolvers: IResolvers = {};
    const mutationType = sourceSchema.getMutationType();
    if (!mutationType) {
        return {};
    }
    //create resolver object
    resolvers.Mutation = {};
    //resolvers
    Object.entries(mutationType.getFields()).forEach(([fieldName, fieldType]) => {
        const fieldTypeType = fieldType.type;
        if (!isObjectType(fieldTypeType)) {
            return;
        }

        const listFields: Record<string, any> = {};
        const nonListFields: Record<string, any> = {};
        Object.values(fieldTypeType.getFields()).forEach((field) => {
            if (isListType(field.type)) {
                listFields[field.name] = field;
            } else {
                nonListFields[field.name] = field;
            }
        });

        if (fieldName.startsWith('add')) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            resolvers.Mutation[fieldName] = async (root, args, __, info) => {
                const mutationType = info.schema.getMutationType();
                if (!mutationType) {
                    throw Error('MutationType not defined');
                }
                const queryType = info.schema.getQueryType();
                if (!queryType) {
                    throw Error('QueryType not defined');
                }
                if (!root && isEqualType(info.parentType, mutationType)) {
                    root = await knex(queryType.name).select('*').first();
                    if (!root) {
                        throw Error('Failed to query query');
                    }
                }
                let selections: string[] = info.fieldNodes[0].selectionSet.selections.map(
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    (selectionNode) => selectionNode.name.value
                );
                const resultTypeFields = info.returnType.getFields();
                for (const selection of selections) {
                    if (isListType(resultTypeFields[selection].type)) {
                        selections = [];
                        break;
                    }
                }
                const nonListInputs: Record<string, any> = {};
                const listInputs: Record<string, any> = {};

                for (const inputName in args.input) {
                    if (listFields.hasOwnProperty(inputName)) {
                        listInputs[inputName] = args.input[inputName];
                    } else if (nonListFields.hasOwnProperty(inputName)) {
                        nonListInputs[inputName] = args.input[inputName];
                    }
                }

                const insertResultIds = await knex(info.returnType.name).insert(nonListInputs);
                const results = await knex(info.returnType.name)
                    .select(...selections)
                    .where({ id: insertResultIds[0] });
                if (results.length > 1) {
                    throw Error('More than one found');
                }

                await Promise.all(
                    Object.entries(listInputs).map(async ([inputName, valueList]) =>
                        Promise.all(
                            valueList.map(async (value: any) => {
                                if (isScalarType(listFields[inputName].type.ofType)) {
                                    await knex(
                                        `__${info.returnType.name}_${inputName}_list`
                                    ).insert({
                                        value,
                                        [`__${info.returnType.name}_id`]: insertResultIds[0],
                                    });
                                } else {
                                    await knex(listFields[inputName].type.ofType.name)
                                        .where({ id: value })
                                        .update({
                                            [`__${info.returnType.name}_id`]: insertResultIds[0],
                                        });
                                }
                            })
                        )
                    )
                );

                return results[0];
            };
        } else if (fieldName.startsWith('update')) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            resolvers.Mutation[fieldName] = async (root, args, __, info) => {
                const mutationType = info.schema.getMutationType();
                if (!mutationType) {
                    throw Error('MutationType not defined');
                }
                const queryType = info.schema.getQueryType();
                if (!queryType) {
                    throw Error('QueryType not defined');
                }
                if (!root && isEqualType(info.parentType, mutationType)) {
                    root = await knex(queryType.name).select('*').first();
                    if (!root) {
                        throw Error('Failed to query query');
                    }
                }
                let selections: string[] = info.fieldNodes[0].selectionSet.selections.map(
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    (selectionNode) => selectionNode.name.value
                );
                const resultTypeFields = info.returnType.getFields();
                for (const selection of selections) {
                    if (isListType(resultTypeFields[selection].type)) {
                        selections = [];
                        break;
                    }
                }
                await knex(info.returnType.name).where({ id: root.id }).update(args.input);
                const result = await knex(info.returnType.name)
                    .select(...selections)
                    .where({ id: root.id });
                if (result.length > 1) {
                    throw Error('More than one found');
                }
                return result[0];
            };
        }
    });
    return resolvers;
}
