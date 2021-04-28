import request from 'supertest';
import { should } from 'chai';
import 'mocha-cakes-2';

import Knex from 'knex';
import Koa from 'koa';

import { createApp } from '../src/createApp';
import { createDBClient } from './utils/createDBClient';
import { removeDBClient } from './utils/removeDBClient';
import config from './testConfig';

should();

Feature('🆕Duomenų atnaujinimo operacijos', async () => {
    Scenario('Atnaujinti Query typeCount', async () => {
        let knex: Knex;
        let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
        const query = `mutation { updateQuery(input: {typeCount: 3}) { typeCount } }`;
        let response: request.Response;
        before(async () => {
            await createDBClient();
            const creationResult = await createApp({
                config,
                typeDefs: 'schema { query: Query } type Query { typeCount: Int }',
            });
            app = creationResult.app;
            knex = creationResult.knex;
        });

        after(async () => {
            await removeDBClient();
        });

        Given(`užklausai "${query}"`, () => {
            query.should.exist;
        });
        When('atsakymas gražinamas', async () => {
            response = await request(app.listen())
                .post(`/`)
                .set('Accept', 'application/json')
                .send({ query });
            response.status.should.be.equal(200);
        });
        Then('atsakymo kūnas turėtų turėti teisingą typeCount', async () => {
            response.body.should.deep.equal({
                data: { updateQuery: [{ typeCount: 3 }] },
            });
        });
        And('duomenų bazėje turėtų būti atnaujinti duomenys', async () => {
            (await knex('Query').where({ typeCount: 3 })).length.should.be.ok;
        });
    });
    Scenario('Atnaujinti Query Book ryšį', async () => {
        let knex: Knex;
        let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
        const query = `mutation { updateQuery(input: {book: "1"}) { book { id } } }`;
        let response: request.Response;
        before(async () => {
            await createDBClient();
            const creationResult = await createApp({
                config,
                typeDefs:
                    'schema { query: Query } type Query { book: Book } type Book { identification: ID }',
            });
            app = creationResult.app;
            knex = creationResult.knex;
            await knex('Book').insert({});
        });
        after(async () => {
            await removeDBClient();
        });

        Given(`Book su id 1 jau yra duomenų bazėje"`, async () => {
            const book = await knex('Book').where({ id: 1 }).first();
            book.should.be.ok;
        });
        And(`užklausai "${query}"`, () => {
            query.should.exist;
        });
        When('atsakymas gražinamas', async () => {
            response = await request(app.listen())
                .post(`/`)
                .set('Accept', 'application/json')
                .send({ query });
            response.status.should.be.equal(200);
        });
        Then('atsakymo kūnas turėtų turėti teisingą book', async () => {
            response.body.should.deep.equal({
                data: { updateQuery: [{ book: { id: '1' } }] },
            });
        });
        And('duomenų bazėje turėtų būti atnaujinti duomenys', async () => {
            (await knex('Query').where({ book: 1 })).length.should.be.ok;
        });
    });
    Scenario('Atnaujinti Query skaliarinį sarašą', async () => {
        let knex: Knex;
        let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
        const query = `mutation { updateQuery(input: {bookNames: ["bob","sam"]}) { bookNames } }`;
        let response: request.Response;
        before(async () => {
            await createDBClient();
            const creationResult = await createApp({
                config,
                typeDefs: 'schema { query: Query } type Query { bookNames: [String] }',
            });
            app = creationResult.app;
            knex = creationResult.knex;
            await knex('__Query_bookNames_list').insert({
                Query_bookNames_id: 1,
                value: 'waka waka',
            });
            await knex('__Query_bookNames_list').insert({ Query_bookNames_id: 1, value: 'eh eh' });
        });
        after(async () => {
            await removeDBClient();
        });

        Given(`2 Book jau yra duomenų bazėje"`, async () => {
            (await knex('__Query_bookNames_list').where({ id: 1 }).first()).should.be.ok;
            (await knex('__Query_bookNames_list').where({ id: 2 }).first()).should.be.ok;
        });

        And(`užklausai "${query}"`, () => {
            query.should.exist;
        });
        When('atsakymas gražinamas', async () => {
            response = await request(app.listen())
                .post(`/`)
                .set('Accept', 'application/json')
                .send({ query });
            response.status.should.be.equal(200);
        });
        Then('atsakymo kūnas turėtų turėti teisingą book', async () => {
            response.body.should.deep.equal({
                data: { updateQuery: [{ bookNames: ['bob', 'sam'] }] },
            });
        });
        And('duomenų bazėje turėtų būti atnaujinti duomenys', async () => {
            (
                await knex('__Query_bookNames_list').where({
                    Query_bookNames_id: 1,
                    value: 'waka waka',
                })
            ).length.should.be.not.ok;
            (await knex('__Query_bookNames_list').where({ Query_bookNames_id: 1, value: 'eh eh' }))
                .length.should.be.not.ok;
            (await knex('__Query_bookNames_list').where({ Query_bookNames_id: 1, value: 'bob' }))
                .length.should.be.ok;
            (await knex('__Query_bookNames_list').where({ Query_bookNames_id: 1, value: 'sam' }))
                .length.should.be.ok;
        });
    });
    Scenario('Atnaujinti Query books ryšius', async () => {
        let knex: Knex;
        let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
        const query = `mutation { updateQuery(input: {books: ["1","2"]}) { books { id } } }`;
        let response: request.Response;
        before(async () => {
            await createDBClient();
            const creationResult = await createApp({
                config,
                typeDefs:
                    'schema { query: Query } type Query { books: [Book] } type Book { identification: ID }',
            });
            app = creationResult.app;
            knex = creationResult.knex;
            await knex('Book').insert({});
            await knex('Book').insert({});
        });
        after(async () => {
            await removeDBClient();
        });

        Given(`2 Book jau yra duomenų bazėje"`, async () => {
            (await knex('Book').where({ id: 1 }).first()).should.be.ok;
            (await knex('Book').where({ id: 2 }).first()).should.be.ok;
        });
        And(`užklausai "${query}"`, () => {
            query.should.exist;
        });
        When('atsakymas gražinamas', async () => {
            response = await request(app.listen())
                .post(`/`)
                .set('Accept', 'application/json')
                .send({ query });
            response.status.should.be.equal(200);
        });
        Then('atsakymo kūnas turėtų turėti teisingą book', async () => {
            response.body.should.deep.equal({
                data: { updateQuery: [{ books: [{ id: '1' }, { id: '2' }] }] },
            });
        });
        And('duomenų bazėje turėtų būti atnaujinti duomenys', async () => {
            (await knex('Book').where({ Query_books_id: 1 })).length.should.be.equal(2);
        });
    });
    Scenario('Atnaujinti Book su Query ryšį', async () => {
        let knex: Knex;
        let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
        const query = `mutation { updateBook(input: {Query_books_id: "1"}) { id } }`;
        let response: request.Response;
        before(async () => {
            await createDBClient();
            const creationResult = await createApp({
                config,
                typeDefs:
                    'schema { query: Query } type Query { books: [Book] } type Book { identification: ID }',
            });
            app = creationResult.app;
            knex = creationResult.knex;
            await knex('Book').insert({});
        });
        after(async () => {
            await removeDBClient();
        });

        Given(`Book su id 1 jau yra duomenų bazėje"`, async () => {
            const book = await knex('Book').where({ id: 1 }).first();
            book.should.be.ok;
        });
        And(`užklausai "${query}"`, () => {
            query.should.exist;
        });
        When('atsakymas gražinamas', async () => {
            response = await request(app.listen())
                .post(`/`)
                .set('Accept', 'application/json')
                .send({ query });
            response.status.should.be.equal(200);
        });
        Then(
            'atsakymo kūnas turėtų turėti klaidų nes nebuvo duoti filtrai ką atnaujinti',
            async () => {
                response.body.errors.should.be.ok;
            }
        );
        And('duomenų bazėje turėtų nebūti atnaujinti duomenys', async () => {
            (await knex('Book').where({ Query_books_id: 1 })).length.should.be.not.ok;
        });
    });
    Scenario('Atnaujinti Book su Query ryšį pagal Book identification', async () => {
        let knex: Knex;
        let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
        const query = `mutation { updateBook(filter: {identification: "6"}, input: {Query_books_id: "1"}) { id } }`;
        let response: request.Response;
        before(async () => {
            await createDBClient();
            const creationResult = await createApp({
                config,
                typeDefs:
                    'schema { query: Query } type Query { books: [Book] } type Book { identification: ID }',
            });
            app = creationResult.app;
            knex = creationResult.knex;
            await knex('Book').insert({ identification: 6 });
        });
        after(async () => {
            await removeDBClient();
        });

        Given(`Book su id 1 jau yra duomenų bazėje"`, async () => {
            const book = await knex('Book').where({ id: 1, identification: 6 }).first();
            book.should.be.ok;
        });
        And(`užklausai "${query}"`, () => {
            query.should.exist;
        });
        When('atsakymas gražinamas', async () => {
            response = await request(app.listen())
                .post(`/`)
                .set('Accept', 'application/json')
                .send({ query });
            response.status.should.be.equal(200);
        });
        Then('atsakymo kūnas turėtų turėti teisingą book', async () => {
            response.body.should.deep.equal({
                data: { updateBook: [{ id: '1' }] },
            });
        });
        And('duomenų bazėje turėtų būti atnaujinti duomenys', async () => {
            (await knex('Book').where({ Query_books_id: 1 })).length.should.be.ok;
        });
    });
});
