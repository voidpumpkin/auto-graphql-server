import { isScalarType, isObjectType } from 'graphql';

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
        .filter(([key, val]) => !isScalarType(val) && key.substr(0, 2) !== '__')
        .map(([key]) => key);

    await Promise.all(
        namedTypesNames.map(async (name) => {
            //create resolver object
            autoResolvers[name] = {};
            //resolver
            const namedType = schemaTypeMap[name];
            if (!isObjectType(namedType)) {
                return autoResolvers;
                // throw new Error('Not object type');
            }
            const fields = Object.entries(namedType.getFields())
                .filter(([, fieldType]) => !isScalarType(fieldType.type))
                .map(([fieldName, fieldType]) => [fieldName, fieldType.name]);
            fields.forEach(([fieldName, fieldTypeName]) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                autoResolvers[name][fieldName] = async () =>
                    await knex.select('*').table(fieldTypeName).first();
            });
        })
    );
    return autoResolvers;
}
