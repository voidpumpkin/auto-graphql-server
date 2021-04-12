import { expect } from 'chai';

import Knex from 'knex';

import { createApp } from '../src/createApp';
import { getSourceSchema } from '../src/schema/getSourceSchema';

import config from './testConfig.json';

describe('Feature: Database table creation', async () => {
    describe('Given schema has Query type', async () => {
        describe('And that type has one scalar', async () => {
            describe('When app is created', async () => {
                let knex: Knex;
                before(async () => {
                    const sourceSchema = getSourceSchema({
                        typeDefs: `schema { query: Query } type Query { name: String }`,
                    });
                    knex = Knex(config.database);
                    await createApp({ config, sourceSchema, knex });
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
        });
        describe('And that type has two scalars', async () => {
            describe('When app is created', async () => {
                let knex: Knex;
                before(async () => {
                    const sourceSchema = getSourceSchema({
                        typeDefs: `schema { query: Query } type Query { name: String iteration: Int }`,
                    });
                    knex = Knex(config.database);
                    await createApp({ config, sourceSchema, knex });
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
                    expect((await knex('Query').columnInfo('iteration')).type).to.be.string(
                        'integer'
                    );
                });
            });
        });
        describe('And it has edge of Book type', async () => {
            describe('And Book has two scalar types', async () => {
                describe('When app is created', async () => {
                    let knex: Knex;
                    before(async () => {
                        const sourceSchema = getSourceSchema({
                            typeDefs: `schema { query: Query } type Query { book(name: String): Book } type Book { name: String iteration: Int }`,
                        });
                        knex = Knex(config.database);
                        await createApp({ config, sourceSchema, knex });
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
                        expect((await knex('Book').columnInfo('name')).type).to.be.string(
                            'varchar'
                        );
                        expect((await knex('Book').columnInfo('iteration')).type).to.be.string(
                            'integer'
                        );
                    });
                    it('Expect foreign key columns to exist', async () => {
                        expect(await knex.schema.hasColumn('Query', 'book')).to.be.true;
                    });
                    it('Expect foreign key columns to have correct type', async () => {
                        expect((await knex('Query').columnInfo('book')).type).to.be.string(
                            'integer'
                        );
                    });
                });
            });
            describe('And Book has edge of Author type', async () => {
                describe('And Author has one scalar type', async () => {
                    describe('When app is created', async () => {
                        let knex: Knex;
                        before(async () => {
                            const sourceSchema = getSourceSchema({
                                typeDefs: `schema { query: Query } type Query { book(author: ID): Book } type Book { author: Author } type Author { name: String }`,
                            });
                            knex = Knex(config.database);
                            await createApp({ config, sourceSchema, knex });
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
            });
            describe('And Book has edge of Author and Book types', async () => {
                describe('And Author has one scalar type', async () => {
                    describe('When app is created', async () => {
                        let knex: Knex;
                        before(async () => {
                            const sourceSchema = getSourceSchema({
                                typeDefs: `schema { query: Query } type Query { book(author: ID): Book } type Book { author: Author book: Book } type Author { name: String }`,
                            });
                            knex = Knex(config.database);
                            await createApp({ config, sourceSchema, knex });
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
        describe('And that type has one scalar list', async () => {
            describe('When app is created', async () => {
                let knex: Knex;
                before(async () => {
                    const sourceSchema = getSourceSchema({
                        typeDefs: `schema { query: Query } type Query { probabilities: [Float] }`,
                    });
                    knex = Knex(config.database);
                    await createApp({ config, sourceSchema, knex });
                });
                it('Expect tables of types with scalar lists to exist', async () => {
                    expect(await knex.schema.hasTable('Query')).to.be.true;
                });
                it('Expect tables of types with scalars have primary key id column', async () => {
                    expect(await knex.schema.hasColumn('Query', 'id')).to.be.true;
                });
                it('Expect tables of scalar lists to exist', async () => {
                    expect(await knex.schema.hasTable('__Query_probabilities_list')).to.be.true;
                });
                it('Expect tables of scalar lists to have columns', async () => {
                    expect(await knex.schema.hasColumn('__Query_probabilities_list', 'id')).to.be
                        .true;
                    expect(await knex.schema.hasColumn('__Query_probabilities_list', 'value')).to.be
                        .true;
                    expect(await knex.schema.hasColumn('__Query_probabilities_list', '__Query_id'))
                        .to.be.true;
                });
                it('Expect columns to match lists scalar types', async () => {
                    expect(
                        (await knex('__Query_probabilities_list').columnInfo('id')).type
                    ).to.be.string('integer');
                    expect(
                        (await knex('__Query_probabilities_list').columnInfo('value')).type
                    ).to.be.string('float');
                    expect(
                        (await knex('__Query_probabilities_list').columnInfo('__Query_id')).type
                    ).to.be.string('integer');
                });
            });
        });
        describe('And that type has two scalar lists', async () => {
            describe('When app is created', async () => {
                let knex: Knex;
                before(async () => {
                    const sourceSchema = getSourceSchema({
                        typeDefs: `schema { query: Query } type Query { probabilities: [Float] executionResults: [Boolean] }`,
                    });
                    knex = Knex(config.database);
                    await createApp({ config, sourceSchema, knex });
                });
                it('Expect tables of types with scalar lists to exist', async () => {
                    expect(await knex.schema.hasTable('Query')).to.be.true;
                });
                it('Expect tables of types with scalars have primary key id column', async () => {
                    expect(await knex.schema.hasColumn('Query', 'id')).to.be.true;
                });
                it('Expect tables of scalar lists to exist', async () => {
                    expect(await knex.schema.hasTable('__Query_probabilities_list')).to.be.true;
                    expect(await knex.schema.hasTable('__Query_executionResults_list')).to.be.true;
                });
                it('Expect tables of scalar lists to have columns', async () => {
                    expect(await knex.schema.hasColumn('__Query_probabilities_list', 'id')).to.be
                        .true;
                    expect(await knex.schema.hasColumn('__Query_probabilities_list', 'value')).to.be
                        .true;
                    expect(await knex.schema.hasColumn('__Query_probabilities_list', '__Query_id'))
                        .to.be.true;
                    expect(await knex.schema.hasColumn('__Query_executionResults_list', 'id')).to.be
                        .true;
                    expect(await knex.schema.hasColumn('__Query_executionResults_list', 'value')).to
                        .be.true;
                    expect(
                        await knex.schema.hasColumn('__Query_executionResults_list', '__Query_id')
                    ).to.be.true;
                });
                it('Expect columns to match lists scalar types', async () => {
                    expect(
                        (await knex('__Query_probabilities_list').columnInfo('id')).type
                    ).to.be.string('integer');
                    expect(
                        (await knex('__Query_probabilities_list').columnInfo('value')).type
                    ).to.be.string('float');
                    expect(
                        (await knex('__Query_probabilities_list').columnInfo('__Query_id')).type
                    ).to.be.string('integer');
                    expect(
                        (await knex('__Query_executionResults_list').columnInfo('id')).type
                    ).to.be.string('integer');
                    expect(
                        (await knex('__Query_executionResults_list').columnInfo('value')).type
                    ).to.be.string('boolean');
                    expect(
                        (await knex('__Query_executionResults_list').columnInfo('__Query_id')).type
                    ).to.be.string('integer');
                });
            });
        });
        describe('And that type has Book list', async () => {
            describe('And Book has one scalar field', async () => {
                describe('When app is created', async () => {
                    let knex: Knex;
                    before(async () => {
                        const sourceSchema = getSourceSchema({
                            typeDefs: `schema { query: Query } type Query { books(name: String): [Book] } type Book { name: String }`,
                        });
                        knex = Knex(config.database);
                        await createApp({ config, sourceSchema, knex });
                    });
                    it('Expect tables to exist', async () => {
                        expect(await knex.schema.hasTable('Query')).to.be.true;
                        expect(await knex.schema.hasTable('Book')).to.be.true;
                    });
                    it('Expect tables to have primary key id column', async () => {
                        expect(await knex.schema.hasColumn('Query', 'id')).to.be.true;
                        expect(await knex.schema.hasColumn('Book', 'id')).to.be.true;
                    });
                    it('Expect tables of object lists to have columns', async () => {
                        expect(await knex.schema.hasColumn('Book', 'name')).to.be.true;
                        expect(await knex.schema.hasColumn('Book', '__Query_id')).to.be.true;
                    });
                    it('Expect columns of object lists to have correct types', async () => {
                        expect((await knex('Book').columnInfo('id')).type).to.be.string('integer');
                        expect((await knex('Book').columnInfo('__Query_id')).type).to.be.string(
                            'integer'
                        );
                    });
                });
            });
        });
        describe('And implements Face', async () => {
            describe('And that interface has one scalar', async () => {
                describe('When app is created', async () => {
                    let knex: Knex;
                    before(async () => {
                        const sourceSchema = getSourceSchema({
                            typeDefs: `schema { query: Query } type Query implements Face { name: String } interface Face { score: Int }`,
                        });
                        knex = Knex(config.database);
                        await createApp({ config, sourceSchema, knex });
                    });
                    it('Expect tables to exist', async () => {
                        expect(await knex.schema.hasTable('Query')).to.be.true;
                    });
                    it('Expect tables to have columns', async () => {
                        expect(await knex.schema.hasColumn('Query', 'name')).to.be.true;
                        expect(await knex.schema.hasColumn('Query', 'id')).to.be.true;
                        expect(await knex.schema.hasColumn('Query', 'score')).to.be.true;
                    });
                    it('Expect columns to have correct types', async () => {
                        expect((await knex('Query').columnInfo('id')).type).to.be.string('integer');
                        expect((await knex('Query').columnInfo('name')).type).to.be.string(
                            'varchar'
                        );
                        expect((await knex('Query').columnInfo('score')).type).to.be.string(
                            'integer'
                        );
                    });
                });
            });
            describe('And that type has one scalar list', async () => {
                describe('When app is created', async () => {
                    let knex: Knex;
                    before(async () => {
                        const sourceSchema = getSourceSchema({
                            typeDefs: `schema { query: Query } type Query implements Face { name: String } interface Face { scores: [Int] }`,
                        });
                        knex = Knex(config.database);
                        await createApp({ config, sourceSchema, knex });
                    });
                    it('Expect tables of types with scalar lists to exist', async () => {
                        expect(await knex.schema.hasTable('Query')).to.be.true;
                    });
                    it('Expect tables of types with scalars have primary key id column', async () => {
                        expect(await knex.schema.hasColumn('Query', 'id')).to.be.true;
                    });
                    it('Expect tables of scalar lists to exist', async () => {
                        expect(await knex.schema.hasTable('__Query_scores_list')).to.be.true;
                    });
                    it('Expect tables of scalar lists to have columns', async () => {
                        expect(await knex.schema.hasColumn('__Query_scores_list', 'id')).to.be.true;
                        expect(await knex.schema.hasColumn('__Query_scores_list', 'value')).to.be
                            .true;
                        expect(await knex.schema.hasColumn('__Query_scores_list', '__Query_id')).to
                            .be.true;
                    });
                    it('Expect columns to match lists scalar types', async () => {
                        expect(
                            (await knex('__Query_scores_list').columnInfo('id')).type
                        ).to.be.string('integer');
                        expect(
                            (await knex('__Query_scores_list').columnInfo('value')).type
                        ).to.be.string('integer');
                        expect(
                            (await knex('__Query_scores_list').columnInfo('__Query_id')).type
                        ).to.be.string('integer');
                    });
                });
            });
            describe('And that type has Book list', async () => {
                describe('And Book has one scalar field', async () => {
                    describe('When app is created', async () => {
                        let knex: Knex;
                        before(async () => {
                            const sourceSchema = getSourceSchema({
                                typeDefs: `schema { query: Query } type Query implements Face { name: String } interface Face { books: [Book] } type Book { name: String }`,
                            });
                            knex = Knex(config.database);
                            await createApp({ config, sourceSchema, knex });
                        });
                        it('Expect tables to exist', async () => {
                            expect(await knex.schema.hasTable('Query')).to.be.true;
                            expect(await knex.schema.hasTable('Book')).to.be.true;
                        });
                        it('Expect tables to have primary key id column', async () => {
                            expect(await knex.schema.hasColumn('Query', 'id')).to.be.true;
                            expect(await knex.schema.hasColumn('Book', 'id')).to.be.true;
                        });
                        it('Expect tables of object lists to have columns', async () => {
                            expect(await knex.schema.hasColumn('Book', 'name')).to.be.true;
                            expect(await knex.schema.hasColumn('Book', '__Query_id')).to.be.true;
                        });
                        it('Expect columns of object lists to have correct types', async () => {
                            expect((await knex('Book').columnInfo('id')).type).to.be.string(
                                'integer'
                            );
                            expect((await knex('Book').columnInfo('__Query_id')).type).to.be.string(
                                'integer'
                            );
                        });
                    });
                });
            });
            describe('And implements Body', async () => {
                describe('And those interfaces have one scalar', async () => {
                    describe('When app is created', async () => {
                        let knex: Knex;
                        before(async () => {
                            const sourceSchema = await getSourceSchema({
                                typeDefs: `schema { query: Query } type Query implements Face & Body { name: String } interface Face { score: Int } interface Body { hasLimbs: Boolean }`,
                            });
                            knex = Knex(config.database);
                            await createApp({ config, sourceSchema, knex });
                        });
                        it('Expect tables to exist', async () => {
                            expect(await knex.schema.hasTable('Query')).to.be.true;
                        });
                        it('Expect tables to have columns', async () => {
                            expect(await knex.schema.hasColumn('Query', 'name')).to.be.true;
                            expect(await knex.schema.hasColumn('Query', 'id')).to.be.true;
                            expect(await knex.schema.hasColumn('Query', 'score')).to.be.true;
                            expect(await knex.schema.hasColumn('Query', 'hasLimbs')).to.be.true;
                        });
                        it('Expect columns to have correct types', async () => {
                            expect((await knex('Query').columnInfo('id')).type).to.be.string(
                                'integer'
                            );
                            expect((await knex('Query').columnInfo('name')).type).to.be.string(
                                'varchar'
                            );
                            expect((await knex('Query').columnInfo('score')).type).to.be.string(
                                'integer'
                            );
                            expect((await knex('Query').columnInfo('hasLimbs')).type).to.be.string(
                                'boolean'
                            );
                        });
                    });
                });
            });
        });
        describe('And implements Face that implements Circle', async () => {
            describe('And those interfaces have one scalar', async () => {
                describe('When app is created', async () => {
                    let knex: Knex;
                    before(async () => {
                        const sourceSchema = await getSourceSchema({
                            typeDefs: `schema { query: Query } type Query implements Face { name: String } interface Face implements Circle { score: Int } interface Circle { hasLimbs: Boolean }`,
                        });
                        knex = Knex(config.database);
                        await createApp({ config, sourceSchema, knex });
                    });
                    it('Expect tables to exist', async () => {
                        expect(await knex.schema.hasTable('Query')).to.be.true;
                    });
                    it('Expect tables to have columns', async () => {
                        expect(await knex.schema.hasColumn('Query', 'name')).to.be.true;
                        expect(await knex.schema.hasColumn('Query', 'id')).to.be.true;
                        expect(await knex.schema.hasColumn('Query', 'score')).to.be.true;
                        expect(await knex.schema.hasColumn('Query', 'hasLimbs')).to.be.true;
                    });
                    it('Expect columns to have correct types', async () => {
                        expect((await knex('Query').columnInfo('id')).type).to.be.string('integer');
                        expect((await knex('Query').columnInfo('name')).type).to.be.string(
                            'varchar'
                        );
                        expect((await knex('Query').columnInfo('score')).type).to.be.string(
                            'integer'
                        );
                        expect((await knex('Query').columnInfo('hasLimbs')).type).to.be.string(
                            'boolean'
                        );
                    });
                });
            });
        });
        describe('And implements Face that implements Circle that implements Figure', async () => {
            describe('And those interfaces have one scalar', async () => {
                describe('When app is created', async () => {
                    let knex: Knex;
                    before(async () => {
                        const sourceSchema = await getSourceSchema({
                            typeDefs: `schema { query: Query } type Query implements Face { name: String } interface Face implements Circle { score: Int } interface Circle implements Figure { hasLimbs: Boolean } interface Figure { figureType: String }`,
                        });
                        knex = Knex(config.database);
                        await createApp({ config, sourceSchema, knex });
                    });
                    it('Expect tables to exist', async () => {
                        expect(await knex.schema.hasTable('Query')).to.be.true;
                    });
                    it('Expect tables to have columns', async () => {
                        expect(await knex.schema.hasColumn('Query', 'name')).to.be.true;
                        expect(await knex.schema.hasColumn('Query', 'id')).to.be.true;
                        expect(await knex.schema.hasColumn('Query', 'score')).to.be.true;
                        expect(await knex.schema.hasColumn('Query', 'hasLimbs')).to.be.true;
                        expect(await knex.schema.hasColumn('Query', 'figureType')).to.be.true;
                    });
                    it('Expect columns to have correct types', async () => {
                        expect((await knex('Query').columnInfo('id')).type).to.be.string('integer');
                        expect((await knex('Query').columnInfo('name')).type).to.be.string(
                            'varchar'
                        );
                        expect((await knex('Query').columnInfo('score')).type).to.be.string(
                            'integer'
                        );
                        expect((await knex('Query').columnInfo('hasLimbs')).type).to.be.string(
                            'boolean'
                        );
                        expect((await knex('Query').columnInfo('figureType')).type).to.be.string(
                            'varchar'
                        );
                    });
                });
            });
        });
    });
});
