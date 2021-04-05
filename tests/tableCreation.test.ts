import { expect } from 'chai';
import Knex from 'knex';

import createApp from '../src/createApp';
import getSourceSchema from '../src/getSourceSchema';

import config from './testConfig.json';

describe('Feature: Database table creation', async () => {
    describe('Given schema is one type deep', async () => {
        describe('And that type has one scalar', async () => {
            let knex: Knex;
            before(async () => {
                const sourceSchema = getSourceSchema({
                    typeDefs: `schema { query: Query } type Query { name: String }`,
                });
                knex = Knex(config.database);
                await createApp(config, sourceSchema, knex);
            });
            it('Expect tables of types with scalars to exist', async () => {
                expect(await knex.schema.hasTable('Query')).to.be.true;
            });
            it('Expect tables of types with scalars have columns', async () => {
                expect(await knex.schema.hasColumn('Query', 'name')).to.be.true;
            });
            it('Expect tables of types with scalars have id column', async () => {
                expect(await knex.schema.hasColumn('Query', 'id')).to.be.true;
            });
            it('Expect columns to match scalar type', async () => {
                expect((await knex('Query').columnInfo('name')).type).to.be.string('varchar');
            });
        });
        describe('And that type has two scalars', async () => {
            let knex: Knex;
            before(async () => {
                const sourceSchema = getSourceSchema({
                    typeDefs: `schema { query: Query } type Query { name: String iteration: Int }`,
                });
                knex = Knex(config.database);
                await createApp(config, sourceSchema, knex);
            });
            it('Expect tables of types with scalars to exist', async () => {
                expect(await knex.schema.hasTable('Query')).to.be.true;
            });
            it('Expect tables of types with scalars have columns', async () => {
                expect(await knex.schema.hasColumn('Query', 'name')).to.be.true;
                expect(await knex.schema.hasColumn('Query', 'iteration')).to.be.true;
            });
            it('Expect tables of types with scalars have id column', async () => {
                expect(await knex.schema.hasColumn('Query', 'id')).to.be.true;
            });
            it('Expect columns to match scalar type', async () => {
                expect((await knex('Query').columnInfo('name')).type).to.be.string('varchar');
                expect((await knex('Query').columnInfo('iteration')).type).to.be.string('integer');
            });
        });
    });
    describe('Given schema is two type deep', async () => {
        describe('And two deep type has two scalars', async () => {
            describe('And one deep type has no scalars', async () => {
                let knex: Knex;
                before(async () => {
                    const sourceSchema = getSourceSchema({
                        typeDefs: `schema { query: Query } type Query { book: Book } type Book { name: String iteration: Int }`,
                    });
                    knex = Knex(config.database);
                    await createApp(config, sourceSchema, knex);
                });
                it('Expect tables of types without scalars to not exist', async () => {
                    expect(await knex.schema.hasTable('Query')).to.be.false;
                });
                it('Expect tables of types with scalars to exist', async () => {
                    expect(await knex.schema.hasTable('Book')).to.be.true;
                });
                it('Expect tables of types with scalars have columns', async () => {
                    expect(await knex.schema.hasColumn('Book', 'name')).to.be.true;
                    expect(await knex.schema.hasColumn('Book', 'iteration')).to.be.true;
                });
                it('Expect tables of types with scalars have id column', async () => {
                    expect(await knex.schema.hasColumn('Book', 'id')).to.be.true;
                });
                it('Expect columns to match scalar type', async () => {
                    expect((await knex('Book').columnInfo('name')).type).to.be.string('varchar');
                    expect((await knex('Book').columnInfo('iteration')).type).to.be.string(
                        'integer'
                    );
                });
            });
            describe('And one deep type has scalars', async () => {
                let knex: Knex;
                before(async () => {
                    const sourceSchema = getSourceSchema({
                        typeDefs: `schema { query: Query } type Query { book: Book name: String } type Book { name: String iteration: Int }`,
                    });
                    knex = Knex(config.database);
                    await createApp(config, sourceSchema, knex);
                });
                it('Expect tables of types with scalars to exist', async () => {
                    expect(await knex.schema.hasTable('Query')).to.be.true;
                    expect(await knex.schema.hasTable('Book')).to.be.true;
                });
                it('Expect tables of types with scalars have columns', async () => {
                    expect(await knex.schema.hasColumn('Query', 'name')).to.be.true;
                    expect(await knex.schema.hasColumn('Book', 'name')).to.be.true;
                    expect(await knex.schema.hasColumn('Book', 'iteration')).to.be.true;
                });
                it('Expect tables of types with scalars have id column', async () => {
                    expect(await knex.schema.hasColumn('Query', 'id')).to.be.true;
                    expect(await knex.schema.hasColumn('Book', 'id')).to.be.true;
                });
                it('Expect columns to match scalar type', async () => {
                    expect((await knex('Query').columnInfo('name')).type).to.be.string('varchar');
                    expect((await knex('Book').columnInfo('name')).type).to.be.string('varchar');
                    expect((await knex('Book').columnInfo('iteration')).type).to.be.string(
                        'integer'
                    );
                });
            });
        });
    });
});
