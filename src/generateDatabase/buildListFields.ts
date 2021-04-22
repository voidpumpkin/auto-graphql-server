import { GraphQLList } from 'graphql';
import Knex from 'knex';
import { buildScalarListField } from './buildScalarListField';

export async function buildListFields({
    listFieldTypeMap,
    objectTypeName,
    knex,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listFieldTypeMap: Record<string, GraphQLList<any>>;
    objectTypeName: string;
    knex: Knex;
}): Promise<void> {
    await Promise.all(
        Object.entries(listFieldTypeMap).map(async ([name, listType]) => {
            const foreignKey = `${objectTypeName}_${name}_id`;
            await buildScalarListField(listType, objectTypeName, name, knex, foreignKey);
        })
    );
}
