import { isObjectType, isListType } from 'graphql';
import Knex from 'knex';
import { IResolvers } from '@graphql-tools/utils';
import { GraphQLSchema } from 'graphql';
import { createAddResolver } from './resolverCreators/createAddResolver';
import { createRemoveResolver } from './resolverCreators/createRemoveResolver';
import { createUpdateResolver } from './resolverCreators/createUpdateResolver';

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
            resolvers.Mutation[fieldName] = createUpdateResolver(
                queryTypeName,
                mutationTypeName,
                knex,
                listFields,
                nonListFields,
                isQueryType,
                returnTypeName
            );
        } else if (fieldName.startsWith('remove')) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            resolvers.Mutation[fieldName] = createRemoveResolver(knex, returnTypeName, listFields);
        }
    });
    return resolvers;
}
