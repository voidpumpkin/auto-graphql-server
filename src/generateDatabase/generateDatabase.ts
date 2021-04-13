import fs from 'fs';
import path from 'path';
import Knex from 'knex';
import { GraphQLSchema, isObjectType } from 'graphql';

import { generateTables } from './generateTables';
import { applyTableConstraints } from './applyTableConstraints';
import { log } from '../logger';
import { Config } from '../createApp';

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

    let knex = Knex(config.database);

    if (config.printSql) {
        knex.on('query', function (queryData) {
            log('📫📭📬', `\x1b[0m\x1b[36m${queryData.sql}\x1b[0m`);
        });
    }

    const schemaTypeMap = sourceSchema.getTypeMap();
    const objectTypeNames = Object.entries(schemaTypeMap)
        .filter(([key, val]) => isObjectType(val) && key.substr(0, 2) !== '__')
        .map(([key]) => key);
    const doesDbAlreadyExist = await knex.schema.hasTable(objectTypeNames[0]);

    if (doesDbAlreadyExist && config.skipDbCreationIfExists) {
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

    await generateTables({ objectTypeNames, knex, schemaTypeMap });
    await applyTableConstraints({ objectTypeNames, schemaTypeMap, knex });
    return knex;
}
