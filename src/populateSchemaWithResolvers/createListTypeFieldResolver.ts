import { isScalarType, isObjectType, GraphQLList, GraphQLType } from 'graphql';
import Knex from 'knex';
import { createModifyRootObject } from './createModifyRootObject';
import { IFieldResolver } from 'graphql-tools';
import { getSelections } from './getSelections';

export function createListTypeFieldResolver(
    knex: Knex,
    fieldType: GraphQLList<GraphQLType>,
    queryTypeName: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryFn?: (tableName: string, selections: string[]) => Promise<any[]>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): IFieldResolver<any, any, any> {
    if (isObjectType(fieldType.ofType)) {
        const resultTypeName = fieldType.ofType.name;
        const resultTypeFields = fieldType.ofType.getFields();

        return async (root, _, __, info) => {
            const modifyRootObject = createModifyRootObject(
                queryTypeName,
                queryTypeName,
                info.schema.getQueryType()
            );
            root = await modifyRootObject(info, root, knex);

            const selections = getSelections(info, resultTypeFields);

            let result;
            if (queryFn) {
                result = await queryFn(resultTypeName, selections);
            } else {
                result = await knex(resultTypeName)
                    .select(...selections)
                    .where({ [`${info.parentType.name}_${info.fieldName}_id`]: root.id });
            }
            return result;
        };
    } else if (isScalarType(fieldType.ofType)) {
        return async (root, _, __, info) => {
            const modifyRootObject = createModifyRootObject(
                queryTypeName,
                queryTypeName,
                info.schema.getQueryType()
            );
            root = await modifyRootObject(info, root, knex);

            const knexResult = await knex(`__${info.parentType.name}_${info.fieldName}_list`)
                .select('value')
                .where({ [`${info.parentType.name}_${info.fieldName}_id`]: root.id });
            return knexResult.map((row) => row.value);
        };
    } else {
        throw Error(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            `${fieldType?.name || fieldType?.ofType?.name || ''} in lists is not implemented`
        );
    }
}
