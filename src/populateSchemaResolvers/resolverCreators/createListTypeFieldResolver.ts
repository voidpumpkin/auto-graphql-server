import { isScalarType, isObjectType } from 'graphql';
import Knex from 'knex';
import { createModifyRootObject } from './utils/createModifyRootObject';
import { IFieldResolver } from 'graphql-tools';
import { getParentListDirective } from '../../directives/getParentListDirective';
import { getParentFieldValue } from '../../directives/getParentFieldValue';

export function createListTypeFieldResolver(
    knex: Knex,
    field: GraphQLListTypeField,
    queryTypeName: string,
    parentType: GraphQLObjectType
): IFieldResolver<all, all, all> {
    const parentListDirective = getParentListDirective(field.astNode);
    const parentListFieldValue = parentListDirective && getParentFieldValue(parentListDirective);
    const fieldName = parentListFieldValue || field.name;
    const listType = field.type.ofType;
    const parentName = parentType.name;
    const childLinkToParentFieldName = `${parentName}_${fieldName}_${listType.name}_id`;
    const listTableName = `__${parentName}_${fieldName}_list`;

    if (isObjectType(listType)) {
        const resultTypeName = listType.name;

        return async (root, args, __, info) => {
            const modifyRootObject = createModifyRootObject(
                queryTypeName,
                queryTypeName,
                info.schema.getQueryType()
            );
            root = await modifyRootObject(info, root, knex);

            if (root[fieldName]) {
                return root[fieldName];
            }

            let result;
            if (parentListDirective) {
                const queryWhere = {
                    id: root[`${resultTypeName}_id`],
                    ...(args?.filter || {}),
                };
                result = await knex(resultTypeName).select().where(queryWhere);
            } else {
                const filters = Object.entries(args?.filter || {}).reduce(
                    (acc, [key, val]) => ({ ...acc, [`${resultTypeName}.${key}`]: val }),
                    {}
                );
                const queryWhere = {
                    [`${listTableName}.${parentName}_id`]: root.id,
                    ...filters,
                };
                result = await knex(listTableName)
                    .select()
                    .innerJoin(
                        resultTypeName,
                        `${resultTypeName}.id`,
                        `${listTableName}.${childLinkToParentFieldName}`
                    )
                    .where(queryWhere);
            }
            return result;
        };
    } else if (isScalarType(listType)) {
        return async (root, _, __, info) => {
            const modifyRootObject = createModifyRootObject(
                queryTypeName,
                queryTypeName,
                info.schema.getQueryType()
            );
            root = await modifyRootObject(info, root, knex);

            const knexResult = await knex(listTableName)
                .select('value')
                .where({ [`${parentName}_id`]: root.id });
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
