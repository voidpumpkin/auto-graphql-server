import { isScalarType, isObjectType, isListType } from 'graphql';
import Knex from 'knex';
import { IResolvers } from '@graphql-tools/utils';
import { GraphQLSchema } from 'graphql';
import { getArgInputs } from './listInputs';
import { createObjectTypeFieldResolver } from './createObjectTypeFieldResolver';
import { createListTypeFieldResolver } from './createListTypeFieldResolver';
import { createModifyRootObject } from './createModifyRootObject';

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
            return;
        }

        const listFields: AnyRecord = {};
        const nonListFields: AnyRecord = {};
        returnTypeFields.forEach((field) => {
            if (isListType(field.type)) {
                listFields[field.name] = field;
            } else {
                nonListFields[field.name] = field;
            }
        });

        if (fieldName.startsWith('add')) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            resolvers.Mutation[fieldName] = async (_, args, __, info) => {
                const [nonListInputs, listInputs] = getArgInputs(
                    args.input,
                    listFields,
                    nonListFields
                );

                const insertResultIds = await knex(info.returnType.name).insert(nonListInputs);

                await Promise.all(
                    Object.entries(listInputs).map(async ([inputName, valueList]) =>
                        Promise.all(
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                const returnResolver = createObjectTypeFieldResolver(
                    knex,
                    info.returnType,
                    queryTypeName,
                    insertResultIds[0]
                );
                return await returnResolver({}, undefined, undefined, info);
            };
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

                if (Object.keys(nonListInputs).length) {
                    await knex(returnTypeName).where({ id: root.id }).update(nonListInputs);
                }

                await Promise.all(
                    Object.entries(listInputs).map(async ([inputName, valueList]) =>
                        Promise.all(
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            valueList.map(async (value: any) => {
                                if (isScalarType(listFields[inputName].type.ofType)) {
                                    const tableName = `__${returnTypeName}_${inputName}_list`;
                                    const relationshipName = `__${returnTypeName}_id`;
                                    await knex(tableName)
                                        .where({ [relationshipName]: root.id })
                                        .delete();
                                    await knex(tableName).insert({
                                        value,
                                        [relationshipName]: root.id,
                                    });
                                } else {
                                    await knex(listFields[inputName].type.ofType.name)
                                        .where({ id: value })
                                        .update({
                                            [`__${returnTypeName}_id`]: root.id,
                                        });
                                }
                            })
                        )
                    )
                );

                const queryWhere = isQueryType ? { id: root.id } : args.filter;
                const returnResolver = createListTypeFieldResolver(
                    knex,
                    info.returnType,
                    queryTypeName,
                    queryWhere
                );
                const results = await returnResolver(root, undefined, undefined, info);

                return results;
            };
        } else if (fieldName.startsWith('remove')) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            resolvers.Mutation[fieldName] = async (_, args, __, info) => {
                const returnResolver = createListTypeFieldResolver(
                    knex,
                    info.returnType,
                    queryTypeName,
                    args.filter
                );
                const results = await returnResolver({}, undefined, undefined, info);

                await knex(returnTypeName).where(args.filter).delete();

                return results;
            };
        }
    });
    return resolvers;
}
