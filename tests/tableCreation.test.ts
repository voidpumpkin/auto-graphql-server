import { expect } from 'chai';

import Knex from 'knex';

import createApp from '../src/createApp';
import getSourceSchema from '../src/getSourceSchema';

import config from './testConfig.json';

describe('Feature: Database table creation', async () => {
    describe('Given schema has Book type', async () => {
        it('Expect error as only properties named mutation, query or subscription', async () => {
            expect(() =>
                getSourceSchema({
                    typeDefs: `schema { book: Book } type Book { name: String }`,
                })
            ).to.throw();
        });
        it('Expect no error as property named mutation is allowed', async () => {
            expect(() =>
                getSourceSchema({
                    typeDefs: `schema { mutation: Book } type Book { name: String }`,
                })
            ).to.not.throw();
        });
        it('Expect no error as property named query is allowed', async () => {
            expect(() =>
                getSourceSchema({
                    typeDefs: `schema { query: Book } type Book { name: String }`,
                })
            ).to.not.throw();
        });
        it('Expect no error as property named subscription is allowed', async () => {
            expect(() =>
                getSourceSchema({
                    typeDefs: `schema { subscription: Book } type Book { name: String }`,
                })
            ).to.not.throw();
        });
    });
    describe('Given schema has Query type', async () => {
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
            it('Expect tables of types with scalars have primary key id column', async () => {
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
        describe('And it has edge of Book type', async () => {
            describe('And Book has two scalar types', async () => {
                let knex: Knex;
                before(async () => {
                    const sourceSchema = getSourceSchema({
                        typeDefs: `schema { query: Query } type Query { book: Book } type Book { name: String iteration: Int }`,
                    });
                    knex = Knex(config.database);
                    await createApp(config, sourceSchema, knex);
                });
                it('Expect tables of types to exist', async () => {
                    expect(await knex.schema.hasTable('Query')).to.be.true;
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
                it('Expect foreign key columns to exist', async () => {
                    expect(await knex.schema.hasColumn('Query', 'book')).to.be.true;
                });
                it('Expect foreign key columns to have correct type', async () => {
                    expect((await knex('Query').columnInfo('book')).type).to.be.string('integer');
                });
            });
            describe('And Book has edge of Author type', async () => {
                describe('And Author has one scalar type', async () => {
                    let knex: Knex;
                    before(async () => {
                        const sourceSchema = getSourceSchema({
                            typeDefs: `schema { query: Query } type Query { book: Book } type Book { author: Author } type Author { name: String }`,
                        });
                        knex = Knex(config.database);
                        await createApp(config, sourceSchema, knex);
                    });
                    it('Expect tables of types to exist', async () => {
                        expect(await knex.schema.hasTable('Query')).to.be.true;
                        expect(await knex.schema.hasTable('Book')).to.be.true;
                        expect(await knex.schema.hasTable('Author')).to.be.true;
                    });
                    it('Expect tables of types with scalars have columns', async () => {
                        expect(await knex.schema.hasColumn('Author', 'name')).to.be.true;
                    });
                    it('Expect tables of types with scalars have id column', async () => {
                        expect(await knex.schema.hasColumn('Author', 'id')).to.be.true;
                    });
                    it('Expect columns to match scalar type', async () => {
                        expect((await knex('Author').columnInfo('name')).type).to.be.string(
                            'varchar'
                        );
                    });
                    it('Expect foreign key columns to exist', async () => {
                        expect(await knex.schema.hasColumn('Query', 'book')).to.be.true;
                        expect(await knex.schema.hasColumn('Book', 'author')).to.be.true;
                    });
                    it('Expect foreign key columns to have correct type', async () => {
                        expect((await knex('Query').columnInfo('book')).type).to.be.string(
                            'integer'
                        );
                        expect((await knex('Book').columnInfo('author')).type).to.be.string(
                            'integer'
                        );
                    });
                });
            });
            describe('And Book has edge of Author and Book types', async () => {
                describe('And Author has one scalar type', async () => {
                    let knex: Knex;
                    before(async () => {
                        const sourceSchema = getSourceSchema({
                            typeDefs: `schema { query: Query } type Query { book: Book } type Book { author: Author book: Book } type Author { name: String }`,
                        });
                        knex = Knex(config.database);
                        await createApp(config, sourceSchema, knex);
                    });
                    it('Expect tables of types to exist', async () => {
                        expect(await knex.schema.hasTable('Query')).to.be.true;
                        expect(await knex.schema.hasTable('Book')).to.be.true;
                        expect(await knex.schema.hasTable('Author')).to.be.true;
                    });
                    it('Expect tables of types with scalars have columns', async () => {
                        expect(await knex.schema.hasColumn('Author', 'name')).to.be.true;
                    });
                    it('Expect tables of types with scalars have id column', async () => {
                        expect(await knex.schema.hasColumn('Author', 'id')).to.be.true;
                    });
                    it('Expect columns to match scalar type', async () => {
                        expect((await knex('Author').columnInfo('name')).type).to.be.string(
                            'varchar'
                        );
                    });
                    it('Expect foreign key columns to exist', async () => {
                        expect(await knex.schema.hasColumn('Query', 'book')).to.be.true;
                        expect(await knex.schema.hasColumn('Book', 'author')).to.be.true;
                        expect(await knex.schema.hasColumn('Book', 'book')).to.be.true;
                    });
                    it('Expect foreign key columns to have correct type', async () => {
                        expect((await knex('Query').columnInfo('book')).type).to.be.string(
                            'integer'
                        );
                        expect((await knex('Book').columnInfo('author')).type).to.be.string(
                            'integer'
                        );
                        expect((await knex('Book').columnInfo('book')).type).to.be.string(
                            'integer'
                        );
                    });
                });
            });
        });
    });
});
