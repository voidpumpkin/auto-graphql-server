import { isObjectType, isScalarType } from 'graphql';
import { GRAPHQL_ID } from '../graphqlConstants';
import { TypeMap } from 'graphql-tools';

export function validateObjectTypesIdFields(schemaTypeMap: TypeMap): void {
    Object.entries(schemaTypeMap).forEach(([objectName, objectType]) => {
        if (!isObjectType(objectType) || objectName.substr(0, 2) === '__') {
            return;
        }
        Object.values(objectType.getFields()).map((field) => {
            if (isScalarType(field.type)) {
                if (field.name === 'id' && field.type?.name !== GRAPHQL_ID) {
                    throw Error(`"id" field can only be ID type`);
                }
            }
        });
    });
}
