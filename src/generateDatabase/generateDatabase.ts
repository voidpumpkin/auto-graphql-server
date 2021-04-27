import fs from 'fs';
import path from 'path';
import Knex from 'knex';
import { GraphQLObjectType, GraphQLSchema, isObjectType } from 'graphql';

import { generateTables } from './generateTables';
import { log } from '../logger';
import { NO_TABLE } from '../directives';

export async function generateDatabase({
    sourceSchema,
    config,
}: {
    sourceSchema: GraphQLSchema;
    config: Config;
}): Promise<Knex> {
    if (!config.database || typeof config.database !== 'object') {
        throw Error('config database field is incorrect or missing');
    }

    let knex = Knex({
        ...config.database,
        log: {
            warn(message) {
                if (!message.includes('.returning() is not supported')) {
                    console.log(message);
                }
            },
            ...(config.database?.log || {}),
        },
    });

    if (config.printSql) {
        knex.on('query', function (queryData) {
            log('📫📭📬', `\x1b[0m\x1b[36m${queryData.sql}\x1b[0m`);
        });
    }

    const schemaTypeMap = sourceSchema.getTypeMap();
    const objectTypes = Object.values(schemaTypeMap).filter(
        (type) =>
            isObjectType(type) &&
            type.name.substr(0, 2) !== '__' &&
            !type.astNode?.directives?.some((d) => d.name.value === NO_TABLE)
    ) as GraphQLObjectType[];
    const doesDbAlreadyExist = await knex.schema.hasTable(objectTypes[0].name);

    if (doesDbAlreadyExist && (config.skipDbCreationIfExists ?? true)) {
        (await import('../logger')).log(
            '💀💀💀',
            '\x1b[1m\x1b[31mSKIPPED TABLE CREATION, DB ALREADY EXISTS'
        );
        return knex;
    }

    if (doesDbAlreadyExist && config.deleteDbCreationIfExists) {
        if (config.database?.client !== 'sqlite') {
            throw Error('deleteDbCreationIfExists only works with sqlite');
        }
        const filename = (config.database?.connection as Knex.Sqlite3ConnectionConfig)?.filename;
        if (!filename) {
            throw Error('connection filename not specified');
        }
        await knex.destroy();
        const schemaFilePath = path.join(__dirname, `../../${filename}`);
        fs.unlinkSync(schemaFilePath);
        knex = Knex(config.database);
    }

    await generateTables({ objectTypes, knex });
    return knex;
}
