import request from 'supertest';
import { expect } from 'chai';

import Knex from 'knex';

import type Koa from 'koa';

import { createApp } from '../src/createApp';
import { getSourceSchema } from '../src/schema/getSourceSchema';

import config from './testConfig.json';

describe('Feature: Read operation', async () => {
    describe('Given schema has Query type', async () => {
        describe('And Query has ID type field id', async () => {
            describe('When a read query is run', async () => {
                let knex: Knex;
                let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
                before(async () => {
                    const sourceSchema = getSourceSchema({
                        typeDefs: `schema { query: Query } type Query { id: ID }`,
                    });
                    knex = Knex(config.database);
                    app = await createApp({ config, sourceSchema, knex });
                    await knex('Query').insert({});
                });
                it('Expect to get correct id', async () => {
                    const query = `{ id }`;
                    const response = await request(app.listen())
                        .post(`/`)
                        .set('Accept', 'application/json')
                        .send({ query });
                    expect(response.status).to.equal(200);
                    expect(response.body).to.deep.equal({
                        data: { id: '1' },
                    });
                });
            });
        });
        describe('And Query has Int type field executionCount', async () => {
            describe('When a read query is run', async () => {
                let knex: Knex;
                let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
                before(async () => {
                    const sourceSchema = getSourceSchema({
                        typeDefs: `schema { query: Query } type Query { executionCount: Int }`,
                    });
                    knex = Knex(config.database);
                    app = await createApp({ config, sourceSchema, knex });
                    await knex('Query').insert({ executionCount: 1 });
                });
                it('Expect to get correct executionCount', async () => {
                    const query = `{ executionCount }`;
                    const response = await request(app.listen())
                        .post(`/`)
                        .set('Accept', 'application/json')
                        .send({ query });
                    expect(response.status).to.equal(200);
                    expect(response.body).to.deep.equal({
                        data: { executionCount: 1 },
                    });
                });
            });
        });
        describe('And Query has Float type field executionCount', async () => {
            describe('When a read query is run', async () => {
                let knex: Knex;
                let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
                before(async () => {
                    const sourceSchema = getSourceSchema({
                        typeDefs: `schema { query: Query } type Query { executionCount: Float }`,
                    });
                    knex = Knex(config.database);
                    app = await createApp({ config, sourceSchema, knex });
                    await knex('Query').insert({ executionCount: 1.2 });
                });
                it('Expect to get correct executionCount', async () => {
                    const query = `{ executionCount }`;
                    const response = await request(app.listen())
                        .post(`/`)
                        .set('Accept', 'application/json')
                        .send({ query });
                    expect(response.status).to.equal(200);
                    expect(response.body).to.deep.equal({
                        data: { executionCount: 1.2 },
                    });
                });
            });
        });
        describe('And Query has String type field name', async () => {
            describe('When a read query is run', async () => {
                let knex: Knex;
                let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
                before(async () => {
                    const sourceSchema = getSourceSchema({
                        typeDefs: `schema { query: Query } type Query { name: String }`,
                    });
                    knex = Knex(config.database);
                    app = await createApp({ config, sourceSchema, knex });
                    await knex('Query').insert({ name: 'bob' });
                });
                it('Expect to get correct name', async () => {
                    const query = `{ name }`;
                    const response = await request(app.listen())
                        .post(`/`)
                        .set('Accept', 'application/json')
                        .send({ query });
                    expect(response.status).to.equal(200);
                    expect(response.body).to.deep.equal({
                        data: { name: 'bob' },
                    });
                });
            });
        });
        describe('And Query has Boolean type field isTrue', async () => {
            describe('When a read query is run', async () => {
                let knex: Knex;
                let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
                before(async () => {
                    const sourceSchema = getSourceSchema({
                        typeDefs: `schema { query: Query } type Query { isTrue: Boolean }`,
                    });
                    knex = Knex(config.database);
                    app = await createApp({ config, sourceSchema, knex });
                    await knex('Query').insert({ isTrue: true });
                });
                it('Expect to get correct isTrue', async () => {
                    const query = `{ isTrue }`;
                    const response = await request(app.listen())
                        .post(`/`)
                        .set('Accept', 'application/json')
                        .send({ query });
                    expect(response.status).to.equal(200);
                    expect(response.body).to.deep.equal({
                        data: { isTrue: true },
                    });
                });
            });
        });
        describe('And Query has field book Book', async () => {
            describe('And Book has field id ID', async () => {
                describe('And database stores 2 Book', async () => {
                    describe('When a read book without args query is run', async () => {
                        let knex: Knex;
                        let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
                        before(async () => {
                            const sourceSchema = getSourceSchema({
                                typeDefs: `schema { query: Query } type Query { book: Book } type Book { id: ID }`,
                            });
                            knex = Knex(config.database);
                            app = await createApp({ config, sourceSchema, knex });
                            await knex('Book').insert({});
                            await knex('Book').insert({});
                            await knex('Query').insert({ book: 2 });
                        });
                        it('Expect to get correct book id', async () => {
                            const query = `{ book{ id } }`;
                            const response = await request(app.listen())
                                .post(`/`)
                                .set('Accept', 'application/json')
                                .send({ query });
                            expect(response.body).to.deep.equal({
                                data: { book: { id: '2' } },
                            });
                        });
                    });
                });
            });
            describe('And Book has field title Title', async () => {
                describe('And Title has field short String', async () => {
                    describe('And database stores 2 Books', async () => {
                        describe('And database stores 2 Titles', async () => {
                            describe('When a read book without args query is run', async () => {
                                let knex: Knex;
                                let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
                                before(async () => {
                                    const sourceSchema = getSourceSchema({
                                        typeDefs: `schema { query: Query } type Query { book: Book } type Book { title: Title } type Title { short: String }`,
                                    });
                                    knex = Knex(config.database);
                                    app = await createApp({ config, sourceSchema, knex });
                                    await knex('Title').insert({ short: 'GOT' });
                                    await knex('Title').insert({ short: 'LOTR' });
                                    await knex('Book').insert({ title: 1 });
                                    await knex('Book').insert({ title: 2 });
                                    await knex('Query').insert({ book: 2 });
                                });
                                it('Expect to get correct title short', async () => {
                                    const query = `{ book{ title{ short } } }`;
                                    const response = await request(app.listen())
                                        .post(`/`)
                                        .set('Accept', 'application/json')
                                        .send({ query });
                                    expect(response.body).to.deep.equal({
                                        data: { book: { title: { short: 'LOTR' } } },
                                    });
                                });
                            });
                        });
                    });
                });
            });
            describe('And Book has field authors [Author]', async () => {
                describe('And Author has field name String', async () => {
                    describe('And database stores 2 Author', async () => {
                        describe('And database stores 1 Book', async () => {
                            describe('When a read books without args query is run', async () => {
                                let knex: Knex;
                                let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
                                before(async () => {
                                    const sourceSchema = getSourceSchema({
                                        typeDefs: `schema { query: Query } type Query { book: Book } type Book { authors: [Author] } type Author { name: String }`,
                                    });
                                    knex = Knex(config.database);
                                    app = await createApp({ config, sourceSchema, knex });
                                    await knex('Book').insert({});
                                    await knex('Query').insert({ book: 1 });
                                    await knex('Author').insert({ name: 'Fab', __Book_id: 1 });
                                    await knex('Author').insert({ name: 'Holoman', __Book_id: 1 });
                                });
                                it('Expect to get correct authors names', async () => {
                                    const query = `{ book{ authors{ name } } }`;
                                    const response = await request(app.listen())
                                        .post(`/`)
                                        .set('Accept', 'application/json')
                                        .send({ query });
                                    expect(response.body).to.deep.equal({
                                        data: {
                                            book: {
                                                authors: [{ name: 'Fab' }, { name: 'Holoman' }],
                                            },
                                        },
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
        describe('And Query has field books [Book]', async () => {
            describe('And Book has field id ID', async () => {
                describe('And database stores 2 Book', async () => {
                    describe('When a read books without args query is run', async () => {
                        let knex: Knex;
                        let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
                        before(async () => {
                            const sourceSchema = getSourceSchema({
                                typeDefs: `schema { query: Query } type Query { books: [Book] } type Book { id: ID }`,
                            });
                            knex = Knex(config.database);
                            app = await createApp({ config, sourceSchema, knex });
                            await knex('Query').insert({});
                            await knex('Book').insert({ __Query_id: 1 });
                            await knex('Book').insert({ __Query_id: 1 });
                        });
                        it('Expect to get correct books ids', async () => {
                            const query = `{ books{ id } }`;
                            const response = await request(app.listen())
                                .post(`/`)
                                .set('Accept', 'application/json')
                                .send({ query });
                            expect(response.body).to.deep.equal({
                                data: { books: [{ id: '1' }, { id: '2' }] },
                            });
                        });
                    });
                });
            });
            describe('And Book has field author Author', async () => {
                describe('And Author has field name String', async () => {
                    describe('And database stores 2 Author', async () => {
                        describe('And database stores 2 Book', async () => {
                            describe('When a read books without args query is run', async () => {
                                let knex: Knex;
                                let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
                                before(async () => {
                                    const sourceSchema = getSourceSchema({
                                        typeDefs: `schema { query: Query } type Query { books: [Book] } type Book { author: Author } type Author { name: String }`,
                                    });
                                    knex = Knex(config.database);
                                    app = await createApp({ config, sourceSchema, knex });
                                    await knex('Query').insert({});
                                    await knex('Author').insert({ name: 'Sam' });
                                    await knex('Author').insert({ name: 'Bob' });
                                    await knex('Book').insert({ __Query_id: 1, author: 1 });
                                    await knex('Book').insert({ __Query_id: 1, author: 2 });
                                });
                                it('Expect to get correct authors names', async () => {
                                    const query = `{ books{ author{ name } } }`;
                                    const response = await request(app.listen())
                                        .post(`/`)
                                        .set('Accept', 'application/json')
                                        .send({ query });
                                    expect(response.body).to.deep.equal({
                                        data: {
                                            books: [
                                                { author: { name: 'Sam' } },
                                                { author: { name: 'Bob' } },
                                            ],
                                        },
                                    });
                                });
                            });
                        });
                    });
                });
            });
            describe('And Book has field authors [Author]', async () => {
                describe('And Author has field name String', async () => {
                    describe('And database stores 4 Author', async () => {
                        describe('And database stores 2 Book', async () => {
                            describe('When a read books without args query is run', async () => {
                                let knex: Knex;
                                let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
                                before(async () => {
                                    const sourceSchema = getSourceSchema({
                                        typeDefs: `schema { query: Query } type Query { books: [Book] } type Book { authors: [Author] } type Author { name: String }`,
                                    });
                                    knex = Knex(config.database);
                                    app = await createApp({ config, sourceSchema, knex });
                                    await knex('Query').insert({});
                                    await knex('Book').insert({ __Query_id: 1 });
                                    await knex('Book').insert({ __Query_id: 1 });
                                    await knex('Author').insert({ name: 'Sam', __Book_id: 2 });
                                    await knex('Author').insert({ name: 'Bob', __Book_id: 2 });
                                    await knex('Author').insert({ name: 'Fab', __Book_id: 1 });
                                    await knex('Author').insert({ name: 'Holoman', __Book_id: 1 });
                                });
                                it('Expect to get correct authors names', async () => {
                                    const query = `{ books{ authors{ name } } }`;
                                    const response = await request(app.listen())
                                        .post(`/`)
                                        .set('Accept', 'application/json')
                                        .send({ query });
                                    expect(response.body).to.deep.equal({
                                        data: {
                                            books: [
                                                { authors: [{ name: 'Fab' }, { name: 'Holoman' }] },
                                                { authors: [{ name: 'Sam' }, { name: 'Bob' }] },
                                            ],
                                        },
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
