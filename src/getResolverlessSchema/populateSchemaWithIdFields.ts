import { mergeSchemas } from '@graphql-tools/merge';
import { GraphQLList, GraphQLObjectType, GraphQLSchema, isListType, isObjectType } from 'graphql';

export function populateSchemaWithIdFields(schema: GraphQLSchema): GraphQLSchema {
    const schemaTypeMap = schema.getTypeMap();
    const objectTypes = Object.values(schemaTypeMap).filter(
        (type) => isObjectType(type) && type.name.substr(0, 2) !== '__'
    ) as GraphQLObjectType[];
    const schemaWithAutoIdFields = objectTypes.reduce((acc, type) => {
        let typeDefs = `type ${type.name} { id: ID } `;
        const listFields = Object.values(type.getFields()).filter(
            ({ type }) => isListType(type) && isObjectType(type.ofType)
        );
        listFields.forEach((field) => {
            const fieldType = field.type as GraphQLList<GraphQLObjectType>;
            const ofTypeName = fieldType.ofType.name;
            typeDefs += `type ${ofTypeName} { ${type.name}_${field.name}_id: ID } `;
        });

        return mergeSchemas({ schemas: [acc], typeDefs });
    }, schema);
    return schemaWithAutoIdFields;
}
