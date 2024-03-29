import { isScalarType, isObjectType, isListType, GraphQLObjectType } from 'graphql';
import Knex from 'knex';
import { IResolvers } from '@graphql-tools/utils';
import { GraphQLSchema } from 'graphql';
import { createObjectTypeFieldResolver } from './resolverCreators/createObjectTypeFieldResolver';
import { createListTypeFieldResolver } from './resolverCreators/createListTypeFieldResolver';
import { recursivelyGetAllFields } from '../generateDatabase/recursivelyGetAllFields';

export function getQueryResolvers(sourceSchema: GraphQLSchema, knex: Knex): IResolvers {
    const resolvers: IResolvers = {};
    const schemaTypeMap = sourceSchema.getTypeMap();
    const objectTypes = Object.values(schemaTypeMap).filter(
        (type) => isObjectType(type) && type.name.substr(0, 2) !== '__'
    ) as GraphQLObjectType[];
    const queryType = sourceSchema.getQueryType();
    if (!queryType) {
        throw Error('QueryType not defined');
    }
    objectTypes.map((objectType) => {
        resolvers[objectType.name] = {};

        const objectFields = recursivelyGetAllFields({ type: objectType });
        objectFields.forEach((field) => {
            if (isListType(field.type)) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                resolvers[objectType.name][field.name] = createListTypeFieldResolver(
                    knex,
                    field as GraphQLListTypeField,
                    queryType.name,
                    objectType
                );
            }
            if (isObjectType(field.type)) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                resolvers[objectType.name][field.name] = createObjectTypeFieldResolver(
                    knex,
                    field as GraphQLObjectTypeField,
                    queryType.name
                );
            }
            if (isScalarType(field.type)) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                resolvers[objectType.name][field.name] = async (root, _args, _ctx, info) => {
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
