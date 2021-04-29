import { isScalarType, DirectiveNode } from 'graphql';
import Knex from 'knex';
import { getArgInputs } from './utils/getArgInputs';
import { createModifyRootObject } from './utils/createModifyRootObject';
import { IFieldResolver } from 'graphql-tools';
import { getParentListDirective } from '../../directives/getParentListDirective';
import { syncAsyncForEatch } from '../../utils/syncAsyncForEatch';
import { createParentListData } from './utils/createParentListData';
import { insertListValue } from './utils/insertListValue';
import { createObjectListData } from './utils/createObjectListData';
import { createScalarListData } from './utils/createScalarListData';

export function createUpdateResolver(
    queryTypeName: string,
    mutationTypeName: string,
    knex: Knex,
    listFields: GraphQLListTypeFieldMap,
    nonListFields: GraphQLNotListTypeFieldMap,
    isQueryType: boolean,
    returnTypeName: string
): IFieldResolver<all, all> {
    return async (root, args, __, info) => {
        const mutationType = info.schema.getMutationType();
        const modifyRootObject = createModifyRootObject(
            queryTypeName,
            mutationTypeName,
            mutationType
        );
        root = await modifyRootObject(info, root, knex);

        const [nonListInputs, listInputs] = getArgInputs(args.input, listFields, nonListFields);
        const filters = args?.filter || {};
        const queryWhere = isQueryType ? { id: root.id } : filters;
        if (!Object.keys(queryWhere).length) {
            throw Error('No filters provided');
        }
        const queryResults = await knex(returnTypeName).where(queryWhere).select('id');
        const updatingRowIds = queryResults.map((e) => e.id);
        if (Object.keys(nonListInputs).length) {
            await knex(returnTypeName).update(nonListInputs).whereIn('id', updatingRowIds);
        }

        await syncAsyncForEatch(Object.entries(listInputs), async ([inputName, valueList]) => {
            const parentListDirective = getParentListDirective(listFields[inputName].astNode);
            const parentType = listFields[inputName].type.ofType;
            if (parentListDirective) {
                await updateParentListsValues(
                    parentListDirective,
                    parentType.name,
                    returnTypeName,
                    knex,
                    updatingRowIds,
                    valueList
                );
            } else if (isScalarType(parentType)) {
                await updateScalarListsValues(
                    returnTypeName,
                    inputName,
                    updatingRowIds,
                    valueList,
                    knex
                );
            } else {
                await updateObjectListsValues(
                    returnTypeName,
                    inputName,
                    parentType.name,
                    knex,
                    updatingRowIds,
                    valueList
                );
            }
        });
        return await knex(returnTypeName).select().where(queryWhere);
    };
}

async function updateScalarListsValues(
    returnTypeName: string,
    inputName: string,
    updatingRowIds: all[],
    valueList: all[],
    knex: Knex
) {
    const listTableData = createScalarListData(returnTypeName, inputName);
    await knex(listTableData.tableName)
        .whereIn(listTableData.parentKeyName, updatingRowIds)
        .delete();

    await syncAsyncForEatch(updatingRowIds, async (updatingRowId) => {
        await syncAsyncForEatch<all>(valueList, async (value) => {
            await insertListValue(listTableData, knex, value, updatingRowId);
        });
    });
}

async function updateObjectListsValues(
    returnTypeName: string,
    inputName: string,
    parentTypeName: string,
    knex: Knex,
    updatingRowIds: all[],
    valueList: all[]
) {
    const listTableData = createObjectListData(returnTypeName, inputName, parentTypeName);
    await knex(listTableData.tableName)
        .whereIn(listTableData.parentKeyName, updatingRowIds)
        .delete();

    await syncAsyncForEatch(updatingRowIds, async (updatingRowId) => {
        await syncAsyncForEatch<all>(valueList, async (childId) => {
            await insertListValue(listTableData, knex, childId, updatingRowId);
        });
    });
}

async function updateParentListsValues(
    parentListDirective: DirectiveNode,
    parentTypeName: string,
    returnTypeName: string,
    knex: Knex,
    updatingRowIds: all[],
    valueList: all[]
) {
    const parentListData = createParentListData(
        parentListDirective,
        parentTypeName,
        returnTypeName
    );
    await knex(parentListData.tableName)
        .whereIn(parentListData.childKeyOrValueName, updatingRowIds)
        .delete();

    await syncAsyncForEatch(updatingRowIds, async (updatingRowId) => {
        await syncAsyncForEatch<all>(valueList, async (parentId) => {
            await insertListValue(parentListData, knex, updatingRowId, parentId);
        });
    });
}
