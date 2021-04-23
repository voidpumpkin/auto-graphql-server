import { isScalarType, isObjectType, isListType, GraphQLObjectType } from 'graphql';
import Knex from 'knex';
import { IResolvers } from '@graphql-tools/utils';
import { GraphQLSchema } from 'graphql';
import { createObjectTypeFieldResolver } from './createObjectTypeFieldResolver';
import { createListTypeFieldResolver } from './createListTypeFieldResolver';

export function getQueryResolvers(sourceSchema: GraphQLSchema, knex: Knex): IResolvers {
    const resolvers: IResolvers = {};
    const schemaTypeMap = sourceSchema.getTypeMap();
    const objectTypesNames = Object.entries(schemaTypeMap)
        .filter(([key, val]) => isObjectType(val) && key.substr(0, 2) !== '__')
        .map(([, val]) => val as GraphQLObjectType);
    const queryType = sourceSchema.getQueryType();
    if (!queryType) {
        throw Error('QueryType not defined');
    }
    const queryTypeName = queryType.name;

    objectTypesNames.map((objectType) => {
        resolvers[objectType.name] = {};

        Object.entries(objectType.getFields()).forEach(([fieldName, field]) => {
            const fieldType = field.type;
            if (isListType(fieldType)) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                resolvers[objectType.name][fieldName] = createListTypeFieldResolver(
                    knex,
                    fieldType,
                    queryTypeName
                );
            }
            if (isObjectType(fieldType)) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                resolvers[objectType.name][fieldName] = createObjectTypeFieldResolver(
                    knex,
                    fieldType,
                    queryTypeName
                );
            }
            if (isScalarType(fieldType)) {
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
