import { isScalarType, isObjectType, GraphQLList, GraphQLType } from 'graphql';
import Knex from 'knex';
import { createModifyRootObject } from './utils/createModifyRootObject';
import { IFieldResolver } from 'graphql-tools';
import { getSelections } from './utils/getSelections';
import { recursivelyGetAllFields } from '../../generateDatabase/recursivelyGetAllFields';

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
        const resultTypeFieldsMap = recursivelyGetAllFields({
            type: fieldType.ofType,
        }).reduce((acc, field) => ({ ...acc, [field.name]: field }), {});

        return async (root, args, __, info) => {
            const modifyRootObject = createModifyRootObject(
                queryTypeName,
                queryTypeName,
                info.schema.getQueryType()
            );
            root = await modifyRootObject(info, root, knex);

            let result;
            if (queryFn) {
                const selections = getSelections(info, resultTypeFieldsMap);
                result = await queryFn(resultTypeName, selections);
            } else {
                const filters = Object.entries(args?.filter || {}).reduce(
                    (acc, [key, val]) => ({ ...acc, [`${resultTypeName}.${key}`]: val }),
                    {}
                );

                if (root?.parentIdsFieldName === info.fieldName) {
                    const queryWhere = {
                        id: root[`${resultTypeName}_id`],
                        ...filters,
                    };
                    result = await knex(resultTypeName).select().where(queryWhere);
                } else {
                    const listTableName = `__${info.parentType.name}_${info.fieldName}_list`;
                    const queryWhere = {
                        [`${listTableName}.${info.parentType.name}_id`]: root.id,
                        ...filters,
                    };
                    result = await knex(listTableName)
                        .select()
                        .innerJoin(
                            resultTypeName,
                            `${resultTypeName}.id`,
                            `${listTableName}.${info.parentType.name}_${info.fieldName}_${resultTypeName}_id`
                        )
                        .where(queryWhere);
                }
            }
            return result.map((r) => ({
                ...r,
                parentIdsFieldName: `${info.parentType.name}_${info.fieldName}_${info.parentType.name}_list`,
            }));
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
