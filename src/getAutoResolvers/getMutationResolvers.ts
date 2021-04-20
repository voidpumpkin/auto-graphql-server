import { isScalarType, isObjectType, isListType } from 'graphql';
import Knex from 'knex';
import { IResolvers } from '@graphql-tools/utils';
import { GraphQLSchema } from 'graphql';
import { getArgInputs } from './listInputs';
import { createObjectTypeFieldResolver } from './createObjectTypeFieldResolver';
import { createListTypeFieldResolver } from './createListTypeFieldResolver';

export function getMutationResolvers(sourceSchema: GraphQLSchema, knex: Knex): IResolvers {
    const resolvers: IResolvers = { Mutation: {} };
    const mutationType = sourceSchema.getMutationType();
    if (!mutationType) {
        return {};
    }
    // const mutationTypeName = mutationType.name;
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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            resolvers.Mutation[fieldName] = async () => {
                return null;
                // const mutationType = info.schema.getMutationType();
                // const modifyRootObject = createModifyRootObject(
                //     queryTypeName,
                //     mutationTypeName,
                //     mutationType
                // );
                // root = await modifyRootObject(info, root, knex);

                // let selections: string[] = info.fieldNodes[0].selectionSet.selections.map(
                //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //     //@ts-ignore
                //     (selectionNode) => selectionNode.name.value
                // );
                // const resultTypeFields = info.returnType.getFields();
                // for (const selection of selections) {
                //     if (isListType(resultTypeFields[selection].type)) {
                //         selections = [];
                //         break;
                //     }
                // }
                // await knex(info.returnType.name).where({ id: root.id }).update(args.input);
                // const result = await knex(info.returnType.name)
                //     .select(...selections)
                //     .where({ id: root.id });
                // if (result.length > 1) {
                //     throw Error('More than one found');
                // }
                // return result[0];
            };
        } else if (fieldName.startsWith('remove')) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            resolvers.Mutation[fieldName] = async (root, args, __, info) => {
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
