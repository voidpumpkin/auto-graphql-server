import { makeExecutableSchema } from '@graphql-tools/schema';

import { GraphQLSchema } from 'graphql';
import { validateQueryType } from './validateQueryType';
import { validateObjectTypesIdFields } from './validateObjectTypesIdFields';
import { populateSchemaMutation } from './populateSchemaMutation';
import { populateSchemaWithIdFields } from './populateSchemaWithIdFields';
import { populateSchemaWithFilterArgs } from './populateSchemaWithFilterArgs';
import { DIRECTIVE_DEFINITION_MAP } from '../directives';

export function getResolverlessSchema(typeDefs: string): GraphQLSchema {
    typeDefs += Object.values(DIRECTIVE_DEFINITION_MAP).join('\n');
    let schema = makeExecutableSchema({ typeDefs });

    //Validations before auto added fields
    validateObjectTypesIdFields(schema.getTypeMap());
    validateQueryType(schema.getQueryType());

    schema = populateSchemaWithIdFields(schema);
    schema = populateSchemaWithFilterArgs(schema);
    schema = populateSchemaMutation(schema);

    return schema;
}
