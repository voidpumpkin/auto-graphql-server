import { GraphQLList } from 'graphql';
import Knex from 'knex';
import { buildObjectScalarField } from './buildObjectScalarField';
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
            const foreignKey = `__${objectTypeName}_id`;
            await buildScalarListField(listType, objectTypeName, name, knex, foreignKey);
            await buildObjectScalarField(listType, knex, objectTypeName, foreignKey);
        })
    );
}
