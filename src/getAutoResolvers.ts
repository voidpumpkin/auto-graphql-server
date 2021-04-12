import { isScalarType, isObjectType, isInterfaceType, isEqualType, isListType } from 'graphql';

import type Knex from 'knex';
import type { IResolvers } from '@graphql-tools/utils';
import type { GraphQLSchema } from 'graphql';

export async function getAutoResolvers({
    sourceSchema,
    knex,
}: {
    sourceSchema: GraphQLSchema;
    knex: Knex;
}): Promise<IResolvers> {
    const autoResolvers: IResolvers = {};
    const schemaTypeMap = sourceSchema.getTypeMap();
    const namedTypesNames = Object.entries(schemaTypeMap)
        .filter(
            ([key, val]) => !isInterfaceType(val) && !isScalarType(val) && key.substr(0, 2) !== '__'
        )
        .map(([key]) => key);

    await Promise.all(
        namedTypesNames.map(async (name) => {
            //create resolver object
            autoResolvers[name] = {};
            //resolver
            const namedType = schemaTypeMap[name];
            if (!isObjectType(namedType)) {
                throw Error('Not object type');
            }
            Object.entries(namedType.getFields()).forEach(([fieldName, fieldType]) => {
                const fieldTypeType = fieldType.type;
                if (isListType(fieldTypeType)) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    autoResolvers[name][fieldName] = async (root, _, __, info) => {
                        const queryType = info.schema.getQueryType();
                        if (!queryType) {
                            throw Error('QueryType not defined');
                        }
                        if (isEqualType(info.parentType, queryType)) {
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
                    };
                }
                if (isObjectType(fieldTypeType)) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    autoResolvers[name][fieldName] = async (root, _, __, info) => {
                        const queryType = info.schema.getQueryType();
                        if (!queryType) {
                            throw Error('QueryType not defined');
                        }
                        if (isEqualType(info.parentType, queryType)) {
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
                    autoResolvers[name][fieldName] = async (root, _, __, info) => {
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
        })
    );
    return autoResolvers;
}
