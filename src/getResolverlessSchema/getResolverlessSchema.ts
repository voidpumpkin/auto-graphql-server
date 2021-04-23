import { makeExecutableSchema } from '@graphql-tools/schema';

import { GraphQLSchema } from 'graphql';
import { validateQueryType } from './validateQueryType';
import { validateObjectTypesIdFields } from './validateObjectTypesIdFields';
import { validateAutomaticlyGenerated } from './validateAutomaticlyGenerated';
import { populateSchemaMutation } from './populateSchemaMutation';
import { populateSchemaWithIdFields } from './populateSchemaWithIdFields';

export function getResolverlessSchema(typeDefs: string): GraphQLSchema {
    const userDefinedSchema = makeExecutableSchema({ typeDefs });

    //Validations before auto added fields
    validateObjectTypesIdFields(userDefinedSchema.getTypeMap());
    validateQueryType(userDefinedSchema.getQueryType());
    validateAutomaticlyGenerated(userDefinedSchema);

    const userDefinedWithAutoIdFields = populateSchemaWithIdFields(userDefinedSchema);
    const schema = populateSchemaMutation(userDefinedWithAutoIdFields);

    return schema;
}
