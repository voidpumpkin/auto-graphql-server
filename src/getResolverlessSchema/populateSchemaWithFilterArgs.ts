import {
    GraphQLField,
    GraphQLObjectType,
    GraphQLSchema,
    isListType,
    isObjectType,
    isScalarType,
} from 'graphql';
import { mergeSchemas } from 'graphql-tools';
import { toSentenceCase } from './toSentenceCase';

export function populateSchemaWithFilterArgs(schema: GraphQLSchema): GraphQLSchema {
    const schemaTypeMap = schema.getTypeMap();
    const objectTypes = Object.values(schemaTypeMap).filter(
        (type) => isObjectType(type) && type.name.substr(0, 2) !== '__'
    ) as GraphQLObjectType[];
    const schemaWithFilterArgs = objectTypes.reduce((acc, type) => {
        let typeDefs = '';
        let typeFields = '';

        Object.values(type.getFields()).forEach((field) => {
            const filterInputTypeName = `${type.name}${toSentenceCase(field.name)}FilterInput`;
            let fieldTypeFieldsString = '';
            let fieldTypeName = '';
            if (isObjectType(field.type)) {
                fieldTypeName = field.type.name;
                const fieldTypeFields = Object.values(field.type.getFields()).filter(
                    (fieldTypeField) => fieldTypeField.name !== 'id'
                );
                fieldTypeFieldsString = getObjectTypeInputFields(fieldTypeFields);
            } else if (isListType(field.type)) {
                if (isObjectType(field.type.ofType)) {
                    fieldTypeName = `[${field.type.ofType.name}]`;
                    const fieldTypeOfTypeFields = Object.values(
                        field.type.ofType.getFields()
                    ).filter(
                        (fieldTypeOfTypeField) =>
                            fieldTypeOfTypeField.name !== `${type.name}_${field.name}_id`
                    );
                    fieldTypeFieldsString = getObjectTypeInputFields(fieldTypeOfTypeFields);
                }
            }

            if (!fieldTypeFieldsString) {
                return;
            }

            typeFields += `${field.name}(filter: ${filterInputTypeName}): ${fieldTypeName} `;
            typeDefs += `input ${filterInputTypeName} { ${fieldTypeFieldsString} } `;
        });

        if (!typeFields) {
            return acc;
        }

        typeDefs += `type ${type.name} {${typeFields}}`;
        return mergeSchemas({ schemas: [acc], typeDefs });
    }, schema);
    return schemaWithFilterArgs;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getObjectTypeInputFields(fields: GraphQLField<any, any>[]): string {
    return fields.reduce((acc, { name, type }) => {
        if (isScalarType(type)) {
            return `${acc} ${name}: ${type.name}`;
        }
        if (isObjectType(type)) {
            return `${acc} ${name}: ID`;
        }
        if (isListType(type)) {
            if (isScalarType(type.ofType)) {
                return `${acc} ${name}: [${type.ofType.name}]`;
            }
            if (isObjectType(type.ofType)) {
                return `${acc} ${name}: [ID]`;
            }
        }
        return acc;
    }, '');
}
