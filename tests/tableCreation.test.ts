import { expect } from 'chai';
import Knex from 'knex';

import createApp from '../src/createApp';
import getSourceSchema from '../src/getSourceSchema';

import config from './testConfig.json';

describe('Database table creation', async () => {
    describe('If schema is one deep and has one primitive', async () => {
        let knex: Knex;
        before(async () => {
            const sourceSchema = getSourceSchema({
                typeDefs: `schema { query: Query } type Query { name: String }`,
            });
            knex = Knex(config.database);
            await createApp(config, sourceSchema, knex);
        });

        it('Expect table to exist', async () => {
            expect(await knex.schema.hasTable('Query')).to.be.true;
        });
        it('Expect table to have primitive name column', async () => {
            expect(await knex.schema.hasColumn('Query', 'name')).to.be.true;
        });
    });
});
