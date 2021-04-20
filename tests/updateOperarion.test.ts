import request from 'supertest';
import { should } from 'chai';
import 'mocha-cakes-2';

import Knex from 'knex';
import Koa from 'koa';

import { createApp } from '../src/createApp';
import { getResolverlessSchema } from '../src/getResolverlessSchema/getResolverlessSchema';
import config from './testConfig.json';

should();

Feature('🆕Duomenų atnaujinimo operacijos', async () => {
    Scenario('Atnaujinti Query typeCount', async () => {
        let knex: Knex;
        let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
        const query = `mutation { updateQuery(input: {typeCount: 3}) { typeCount } }`;
        let response: request.Response;
        before(async () => {
            const resolverlessSchema = getResolverlessSchema({
                typeDefs: `schema { query: Query } type Query { typeCount: Int }`,
            });
            const creationResult = await createApp({
                config,
                resolverlessSchema,
            });
            app = creationResult.app;
            knex = creationResult.knex;
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
            const resolverlessSchema = getResolverlessSchema({
                typeDefs: `schema { query: Query } type Query { book: Book } type Book { id: ID }`,
            });
            const creationResult = await createApp({
                config,
                resolverlessSchema,
            });
            app = creationResult.app;
            knex = creationResult.knex;
            await knex('Book').insert({});
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
            const resolverlessSchema = getResolverlessSchema({
                typeDefs: `schema { query: Query } type Query { bookNames: [String] }`,
            });
            const creationResult = await createApp({
                config,
                resolverlessSchema,
            });
            app = creationResult.app;
            knex = creationResult.knex;
            await knex('__Query_bookNames_list').insert({ ['__Query_id']: 1, value: 'waka waka' });
            await knex('__Query_bookNames_list').insert({ ['__Query_id']: 1, value: 'eh eh' });
        });
        Given(`2 Book jau yra duomenų bazėje"`, async () => {
            (await knex('__Query_bookNames_list').where({ id: 1 }).first()).should.be.ok;
            (await knex('__Query_bookNames_list').where({ id: 2 }).first()).should.be.ok;
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
        Then('atsakymo kūnas turėtų turėti teisingą book', async () => {
            response.body.should.deep.equal({
                data: { updateQuery: [{ bookNames: ['bob', 'sam'] }] },
            });
        });
        And('duomenų bazėje turėtų būti atnaujinti duomenys', async () => {
            (await knex('__Query_bookNames_list').where({ ['__Query_id']: 1, value: 'waka waka' }))
                .length.should.be.not.ok;
            (await knex('__Query_bookNames_list').where({ ['__Query_id']: 1, value: 'eh eh' }))
                .length.should.be.not.ok;
            (await knex('__Query_bookNames_list').where({ ['__Query_id']: 1, value: 'bob' })).length
                .should.be.ok;
            (await knex('__Query_bookNames_list').where({ ['__Query_id']: 1, value: 'sam' })).length
                .should.be.ok;
        });
    });
    Scenario('Atnaujinti Query books ryšius', async () => {
        let knex: Knex;
        let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
        const query = `mutation { updateQuery(input: {books: ["1","2"]}) { books { id } } }`;
        let response: request.Response;
        before(async () => {
            const resolverlessSchema = getResolverlessSchema({
                typeDefs: `schema { query: Query } type Query { books: [Book] } type Book { id: ID }`,
            });
            const creationResult = await createApp({
                config,
                resolverlessSchema,
            });
            app = creationResult.app;
            knex = creationResult.knex;
            await knex('Book').insert({});
            await knex('Book').insert({});
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
            (await knex('Book').where({ ['__Query_id']: 1 })).length.should.be.equal(2);
        });
    });
});
