import { isListType, isObjectType, isScalarType } from 'graphql';
import { TypeMap } from 'graphql-tools';

export function validateObjectTypesIdFields(schemaTypeMap: TypeMap): void {
    Object.entries(schemaTypeMap).forEach(([objectName, objectType]) => {
        if (!isObjectType(objectType) || objectName.substr(0, 2) === '__') {
            return;
        }
        Object.values(objectType.getFields()).map((field) => {
            if (isScalarType(field.type)) {
                if (field.name === 'id') {
                    throw Error(
                        `In type ${objectName}, "${field.name}" field will be automaticly added, please remove it`
                    );
                }
            } else if (isListType(field.type)) {
                if (isObjectType(field.type.ofType)) {
                    Object.values(field.type.ofType.getFields()).forEach((ofTypeField) => {
                        const foreignKeyFieldName = `${objectName}_${field.name}_id`;
                        if (ofTypeField.name === `${objectName}_${field.name}_id`) {
                            throw Error(
                                `In type ${objectName}, "${foreignKeyFieldName}" field will be automaticly added, please remove it`
                            );
                        }
                    });
                }
            }
        });
    });
}
