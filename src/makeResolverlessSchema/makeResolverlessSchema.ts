import { makeExecutableSchema } from '@graphql-tools/schema';

import { GraphQLSchema } from 'graphql';
import { validateQueryType } from './validators/validateQueryType';
import { validateObjectTypesIdFields } from './validators/validateObjectTypesIdFields';
import { populateSchemaMutation } from './populators/populateSchemaMutation';
import { populateSchemaWithIdFields } from './populators/populateSchemaWithIdFields';
import { populateSchemaWithFilterArgs } from './populators/populateSchemaWithFilterArgs';
import { DIRECTIVE_DEFINITION_MAP } from '../directives/directives';

export function makeResolverlessSchema(typeDefs: string): GraphQLSchema {
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
