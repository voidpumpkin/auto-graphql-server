import { IResolvers } from '@graphql-tools/utils';
import Knex from 'knex';

export function getCustomResolvers(
    customResolverBuilderMap: CustomResolverBuilderMap,
    knex: Knex
): IResolvers {
    return Object.entries(customResolverBuilderMap).reduce(
        (accCustomResolvers, [typeName, fieldResolverBuilderMap]) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            accCustomResolvers[typeName] = Object.entries(fieldResolverBuilderMap).reduce(
                (accFieldResolvers, [fieldName, customResolverBuilder]) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    accFieldResolvers[fieldName] = customResolverBuilder(knex);
                    return accFieldResolvers;
                },
                {}
            );
            return accCustomResolvers;
        },
        {}
    ) as IResolvers;
}
