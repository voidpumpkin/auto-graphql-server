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

Feature('🧹Duomenų trynimo operacijos', async () => {
    Scenario('Trinti Query', async () => {
        let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
        const query = `mutation { removeQuery() { id } }`;
        let response: request.Response;
        before(async () => {
            await createDBClient();
            const creationResult = await createApp({
                config,
                typeDefs: 'schema { query: Query } type Query { identification: ID }',
            });
            app = creationResult.app;
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
            response.status.should.be.equal(400);
        });
        Then(
            'atsakymo kūnas turėtų turėti klaidų, nes query trynimo operacija draudžiama',
            async () => {
                response.body.errors.length.should.be.ok;
            }
        );
    });
    Scenario('Schemos Book tipas turi ID skaliarą', async () => {
        let knex: Knex;
        let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
        const query = `mutation { removeBook(filter: {id: "1"}) { id } }`;
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

        Given(`užklausai "${query}"`, () => {
            query.should.exist;
        });
        And('Book su id 1 jau yra duomenų bazėje', async () => {
            (await knex('Book').where({ id: 1 }).first()).should.be.ok;
        });
        When('atsakymas gražinamas', async () => {
            response = await request(app.listen())
                .post(`/`)
                .set('Accept', 'application/json')
                .send({ query });
            response.status.should.be.equal(200);
        });
        Then('atsakymo kūnas turėtų turėti teisingą id', async () => {
            response.body.should.deep.equal({
                data: { removeBook: [{ id: '1' }] },
            });
        });
        And('duomenų bazėje turėtų būti ištrinti duomenys', async () => {
            (await knex('Book').where({ id: '1' })).length.should.not.be.ok;
        });
    });
    Scenario('Schemos Book tipas turi String skaliarą', async () => {
        let knex: Knex;
        let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
        const query = `mutation { removeBook(filter: {name: "1"}) { name } }`;
        let response: request.Response;
        before(async () => {
            await createDBClient();
            const creationResult = await createApp({
                config,
                typeDefs:
                    'schema { query: Query } type Query { book: Book } type Book { name: String }',
            });
            app = creationResult.app;
            knex = creationResult.knex;
            await knex('Book').insert({ name: '1' });
        });

        after(async () => {
            await removeDBClient();
        });

        Given(`užklausai "${query}"`, () => {
            query.should.exist;
        });
        And('Book jau yra duomenų bazėje', async () => {
            (await knex('Book').where({ name: '1' }).first()).should.be.ok;
        });
        When('atsakymas gražinamas', async () => {
            response = await request(app.listen())
                .post(`/`)
                .set('Accept', 'application/json')
                .send({ query });
            response.status.should.be.equal(200);
        });
        Then('atsakymo kūnas turėtų turėti teisingą name', async () => {
            response.body.should.deep.equal({
                data: { removeBook: [{ name: '1' }] },
            });
        });
        And('duomenų bazėje turėtų būti ištrinti duomenys', async () => {
            (await knex('Book').where({ name: '1' })).length.should.not.be.ok;
        });
    });
    Scenario('Schemos Book tipas turi Boolean skaliarą', async () => {
        let knex: Knex;
        let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
        const query = `mutation { removeBook(filter: {readable: true}) { readable } }`;
        let response: request.Response;
        before(async () => {
            await createDBClient();
            const creationResult = await createApp({
                config,
                typeDefs:
                    'schema { query: Query } type Query { book: Book } type Book { readable: Boolean }',
            });
            app = creationResult.app;
            knex = creationResult.knex;
            await knex('Book').insert({ readable: true });
        });

        after(async () => {
            await removeDBClient();
        });

        Given(`užklausai "${query}"`, () => {
            query.should.exist;
        });
        And('Book su id 1 jau yra duomenų bazėje', async () => {
            (await knex('Book').where({ readable: true }).first()).should.be.ok;
        });
        When('atsakymas gražinamas', async () => {
            response = await request(app.listen())
                .post(`/`)
                .set('Accept', 'application/json')
                .send({ query });
            response.status.should.be.equal(200);
        });
        Then('atsakymo kūnas turėtų turėti teisingą readable', async () => {
            response.body.should.deep.equal({
                data: { removeBook: [{ readable: true }] },
            });
        });
        And('duomenų bazėje turėtų būti ištrinti duomenys', async () => {
            (await knex('Book').where({ readable: true })).length.should.not.be.ok;
        });
    });
    Scenario('Schemos Book tipas turi Int skaliarą', async () => {
        let knex: Knex;
        let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
        const query = `mutation { removeBook(filter: {pages: 5}) { pages } }`;
        let response: request.Response;
        before(async () => {
            await createDBClient();
            const creationResult = await createApp({
                config,
                typeDefs:
                    'schema { query: Query } type Query { book: Book } type Book { pages: Int }',
            });
            app = creationResult.app;
            knex = creationResult.knex;
            await knex('Book').insert({ pages: 5 });
        });

        after(async () => {
            await removeDBClient();
        });

        Given(`užklausai "${query}"`, () => {
            query.should.exist;
        });
        And('Book su id 1 jau yra duomenų bazėje', async () => {
            (await knex('Book').where({ pages: 5 }).first()).should.be.ok;
        });
        When('atsakymas gražinamas', async () => {
            response = await request(app.listen())
                .post(`/`)
                .set('Accept', 'application/json')
                .send({ query });
            response.status.should.be.equal(200);
        });
        Then('atsakymo kūnas turėtų turėti teisingą pages', async () => {
            response.body.should.deep.equal({
                data: { removeBook: [{ pages: 5 }] },
            });
        });
        And('duomenų bazėje turėtų būti ištrinti duomenys', async () => {
            (await knex('Book').where({ pages: 5 })).length.should.not.be.ok;
        });
    });
    Scenario('Schemos Book tipas turi Float skaliarą', async () => {
        let knex: Knex;
        let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
        const query = `mutation { removeBook(filter: {probability: 0.3}) { probability } }`;
        let response: request.Response;
        before(async () => {
            await createDBClient();
            const creationResult = await createApp({
                config,
                typeDefs:
                    'schema { query: Query } type Query { book: Book } type Book { probability: Float }',
            });
            app = creationResult.app;
            knex = creationResult.knex;
            await knex('Book').insert({ probability: 0.3 });
        });

        after(async () => {
            await removeDBClient();
        });

        Given(`užklausai "${query}"`, () => {
            query.should.exist;
        });
        And('Book su id 1 jau yra duomenų bazėje', async () => {
            (await knex('Book').where({ probability: 0.3 }).first()).should.be.ok;
        });
        When('atsakymas gražinamas', async () => {
            response = await request(app.listen())
                .post(`/`)
                .set('Accept', 'application/json')
                .send({ query });
            response.status.should.be.equal(200);
        });
        Then('atsakymo kūnas turėtų turėti teisingą probability', async () => {
            response.body.should.deep.equal({
                data: { removeBook: [{ probability: 0.3 }] },
            });
        });
        And('duomenų bazėje turėtų būti ištrinti duomenys', async () => {
            (await knex('Book').where({ probability: 0.3 })).length.should.not.be.ok;
        });
    });
    Scenario('Trinti 2 vienodus Book', async () => {
        let knex: Knex;
        let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
        const query = `mutation { removeBook(filter: {name: "1"}) { name } }`;
        let response: request.Response;
        before(async () => {
            await createDBClient();
            const creationResult = await createApp({
                config,
                typeDefs:
                    'schema { query: Query } type Query { books: [Book] } type Book { name: String }',
            });
            app = creationResult.app;
            knex = creationResult.knex;
            await knex('Book').insert({ name: '1' });
            await knex('Book').insert({ name: '1' });
        });

        after(async () => {
            await removeDBClient();
        });

        Given(`užklausai "${query}"`, () => {
            query.should.exist;
        });
        And('Book jau yra duomenų bazėje', async () => {
            (await knex('Book').where({ name: '1' }).first()).should.be.ok;
        });
        When('atsakymas gražinamas', async () => {
            response = await request(app.listen())
                .post(`/`)
                .set('Accept', 'application/json')
                .send({ query });
            response.status.should.be.equal(200);
        });
        Then('atsakymo kūnas turėtų turėti teisingą atsakymą', async () => {
            response.body.should.deep.equal({
                data: { removeBook: [{ name: '1' }, { name: '1' }] },
            });
        });
        And('duomenų bazėje turėtų būti ištrinti duomenys', async () => {
            (await knex('Book').where({ name: '1' })).length.should.not.be.ok;
        });
    });
    Scenario('Schemos Book tipas turi objiektą Author', async () => {
        let knex: Knex;
        let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
        const query = `mutation { removeBook(filter: {author: "1"}) { author { name } } }`;
        let response: request.Response;
        before(async () => {
            await createDBClient();
            const creationResult = await createApp({
                config,
                typeDefs:
                    'schema { query: Query } type Query { book: Book } type Book { author: Author } type Author { name: String }',
            });
            app = creationResult.app;
            knex = creationResult.knex;
            await knex('Author').insert({ name: 'bob' });
            await knex('Book').insert({ author: '1' });
        });

        after(async () => {
            await removeDBClient();
        });

        Given(`užklausai "${query}"`, () => {
            query.should.exist;
        });
        And('Book jau yra duomenų bazėje', async () => {
            (await knex('Book').where({ author: '1' }).first()).should.be.ok;
        });
        And('Author jau yra duomenų bazėje', async () => {
            (await knex('Author').where({ name: 'bob' }).first()).should.be.ok;
        });
        When('atsakymas gražinamas', async () => {
            response = await request(app.listen())
                .post(`/`)
                .set('Accept', 'application/json')
                .send({ query });
            response.status.should.be.equal(200);
        });
        Then('atsakymo kūnas turėtų turėti teisingą atsakymą', async () => {
            response.body.should.deep.equal({
                data: { removeBook: [{ author: { name: 'bob' } }] },
            });
        });
        And('duomenų bazėje turėtų būti ištrinti duomenys', async () => {
            (await knex('Book').where({ author: 1 })).length.should.not.be.ok;
        });
    });
    Scenario('Schemos Book tipas turi sąrašą Author', async () => {
        let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
        const query = `mutation { removeBook(filter: {authors: ["1"]}) { authors { name } } }`;
        let response: request.Response;
        before(async () => {
            await createDBClient();
            const creationResult = await createApp({
                config,
                typeDefs:
                    'schema { query: Query } type Query { book: Book } type Book { authors: [Author] } type Author { name: String }',
            });
            app = creationResult.app;
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
            response.status.should.be.equal(400);
        });
        Then(
            'atsakymo kūnas turėtų turėti klaidų, nes trynimo operacija pagal sąrašą draudžiama',
            async () => {
                response.body.errors.length.should.be.ok;
            }
        );
    });
});
