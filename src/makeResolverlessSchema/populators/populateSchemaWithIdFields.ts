import { mergeSchemas } from '@graphql-tools/merge';
import { GraphQLList, GraphQLObjectType, GraphQLSchema, isListType, isObjectType } from 'graphql';
import { NO_CHILD_TO_PARENT_LINK, PARENTS_LIST } from '../../directives/directives';

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
            if (
                !field.astNode?.directives?.some((d) =>
                    ([NO_CHILD_TO_PARENT_LINK, PARENTS_LIST] as string[]).includes(d.name.value)
                )
            ) {
                typeDefs += `type ${ofTypeName} { ${type.name}_${field.name}_${type.name}_list: [${type.name}] @${PARENTS_LIST}(parentField: "${field.name}") } `;
            }
        });

        return mergeSchemas({ schemas: [acc], typeDefs });
    }, schema);
    return schemaWithAutoIdFields;
}
