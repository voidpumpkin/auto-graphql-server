import { GraphQLSchema } from 'graphql';

export function validateAutomaticlyGenerated(schema: GraphQLSchema): void {
    if (schema.getMutationType()) {
        throw Error('mutation will be generated, please delete it');
    }
    if (schema.getType('Mutation')) {
        throw Error('Mutation will be generated, please delete it');
    }
}
