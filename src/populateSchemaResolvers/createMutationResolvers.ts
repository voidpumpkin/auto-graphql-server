import { isScalarType, isObjectType, isListType } from 'graphql';
import Knex from 'knex';
import { IResolvers } from '@graphql-tools/utils';
import { GraphQLSchema } from 'graphql';
import { getArgInputs } from './resolverCreators/utils/getArgInputs';
import { createModifyRootObject } from './resolverCreators/utils/createModifyRootObject';
import { createAddResolver } from './resolverCreators/createAddResolver';
import { createRemoveResolver } from './resolverCreators/createRemoveResolver';

export function getMutationResolvers(sourceSchema: GraphQLSchema, knex: Knex): IResolvers {
    const resolvers: IResolvers = { Mutation: {} };
    const mutationType = sourceSchema.getMutationType();
    if (!mutationType) {
        return {};
    }
    const mutationTypeName = mutationType.name;
    const queryType = sourceSchema.getQueryType();
    if (!queryType) {
        throw Error('QueryType not defined');
    }
    const queryTypeName = queryType.name;

    Object.entries(mutationType.getFields()).forEach(([fieldName, fieldType]) => {
        const fieldTypeType = fieldType.type;
        let returnTypeName: string;
        let returnTypeFields = [];
        if (isObjectType(fieldTypeType)) {
            returnTypeName = fieldTypeType.name;
            returnTypeFields = Object.values(fieldTypeType.getFields());
        } else if (isListType(fieldTypeType) && isObjectType(fieldTypeType.ofType)) {
            returnTypeName = fieldTypeType.ofType.name;
            returnTypeFields = Object.values(fieldTypeType.ofType.getFields());
        } else {
            returnTypeName = fieldName.slice(6);
            const returnType = sourceSchema.getTypeMap()[returnTypeName];
            if (returnType && isObjectType(returnType)) {
                returnTypeFields = Object.values(returnType.getFields());
            } else {
                return;
            }
        }

        const listFields: GraphQLListTypeFieldMap = {};
        const nonListFields: GraphQLNotListTypeFieldMap = {};
        returnTypeFields.forEach((field) => {
            if (isListType(field.type)) {
                listFields[field.name] = field as GraphQLListTypeField;
            } else {
                nonListFields[field.name] = field as GraphQLNotListTypeField;
            }
        });

        if (fieldName.startsWith('add')) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            resolvers.Mutation[fieldName] = createAddResolver(
                listFields,
                nonListFields,
                knex,
                queryTypeName
            );
        } else if (fieldName.startsWith('update')) {
            const isQueryType = returnTypeName === queryType.name;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            resolvers.Mutation[fieldName] = async (root, args, __, info) => {
                const mutationType = info.schema.getMutationType();
                const modifyRootObject = createModifyRootObject(
                    queryTypeName,
                    mutationTypeName,
                    mutationType
                );
                root = await modifyRootObject(info, root, knex);
                const [nonListInputs, listInputs] = getArgInputs(
                    args.input,
                    listFields,
                    nonListFields
                );
                const queryWhere = isQueryType ? { id: root.id } : args?.filter;
                if (!Object.keys(queryWhere).length) {
                    throw Error('No filters provided');
                }
                const queryResults = await knex(returnTypeName).where(queryWhere).select('id');
                const updatingRowIds = queryResults.map((e) => e.id);
                if (Object.keys(nonListInputs).length) {
                    await knex(returnTypeName).update(nonListInputs).whereIn('id', updatingRowIds);
                }
                await Promise.all(
                    Object.entries(listInputs).map(async ([inputName, valueList]) => {
                        const tableName = `__${returnTypeName}_${inputName}_list`;
                        const relationshipName = `${returnTypeName}_${inputName}_id`;
                        if (isScalarType(listFields[inputName].type.ofType)) {
                            await knex(tableName)
                                .where({ [relationshipName]: root.id })
                                .delete();
                            await valueList.reduce(
                                async (prevPromise: Promise<void>, value: all) => {
                                    await prevPromise;
                                    await knex(tableName).insert({
                                        value,
                                        [relationshipName]: root.id,
                                    });
                                },
                                Promise.resolve(undefined)
                            );
                        } else {
                            await valueList.reduce(
                                async (prevPromise: Promise<void>, value: all) => {
                                    await prevPromise;
                                    await knex(listFields[inputName].type.ofType.name)
                                        .where({ id: value })
                                        .update({
                                            [`${returnTypeName}_${inputName}_id`]: root.id,
                                        });
                                },
                                Promise.resolve(undefined)
                            );
                        }
                    })
                );
                // const returnResolver = createListTypeFieldResolver(
                //     knex,
                //     info.returnType,
                //     queryTypeName,
                //     async (tableName) =>
                //         await knex(tableName).select().whereIn('id', updatingRowIds)
                // );
                // const results = await returnResolver(root, undefined, undefined, info);
                return null;
            };
        } else if (fieldName.startsWith('remove')) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            resolvers.Mutation[fieldName] = createRemoveResolver(knex, returnTypeName, listFields);
        }
    });
    return resolvers;
}
