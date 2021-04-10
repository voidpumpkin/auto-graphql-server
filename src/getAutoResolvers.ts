import { isScalarType, isObjectType, isInterfaceType } from 'graphql';

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
                throw new Error('Not object type');
            }
            Object.entries(namedType.getFields()).forEach(([fieldName, fieldType]) => {
                const fieldTypeType = fieldType.type;
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
