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
        const query = `mutation { removeQuery }`;
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
    Scenario('Trinti be filtrų', async () => {
        let knex: Knex;
        let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
        const query = `mutation { removeBook }`;
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
                data: { removeBook: ['1'] },
            });
        });
        And('duomenų bazėje turėtų būti ištrinti duomenys', async () => {
            (await knex('Book').where({ id: '1' })).length.should.not.be.ok;
        });
    });
    Scenario('Trinti pagal ID skaliarą', async () => {
        let knex: Knex;
        let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
        const query = `mutation { removeBook(filter: {id: "1"}) }`;
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
                data: { removeBook: ['1'] },
            });
        });
        And('duomenų bazėje turėtų būti ištrinti duomenys', async () => {
            (await knex('Book').where({ id: '1' })).length.should.not.be.ok;
        });
    });
    Scenario('Trinti pagal String skaliarą', async () => {
        let knex: Knex;
        let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
        const query = `mutation { removeBook(filter: {name: "1"}) }`;
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
                data: { removeBook: ['1'] },
            });
        });
        And('duomenų bazėje turėtų būti ištrinti duomenys', async () => {
            (await knex('Book').where({ name: '1' })).length.should.not.be.ok;
        });
    });
    Scenario('Trinti pagal Boolean skaliarą', async () => {
        let knex: Knex;
        let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
        const query = `mutation { removeBook(filter: {readable: true}) }`;
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
                data: { removeBook: ['1'] },
            });
        });
        And('duomenų bazėje turėtų būti ištrinti duomenys', async () => {
            (await knex('Book').where({ readable: true })).length.should.not.be.ok;
        });
    });
    Scenario('Trinti pagal Int skaliarą', async () => {
        let knex: Knex;
        let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
        const query = `mutation { removeBook(filter: {pages: 5}) }`;
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
                data: { removeBook: ['1'] },
            });
        });
        And('duomenų bazėje turėtų būti ištrinti duomenys', async () => {
            (await knex('Book').where({ pages: 5 })).length.should.not.be.ok;
        });
    });
    Scenario('Trinti pagal Float skaliarą', async () => {
        let knex: Knex;
        let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
        const query = `mutation { removeBook(filter: {probability: 0.3}) }`;
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
                data: { removeBook: ['1'] },
            });
        });
        And('duomenų bazėje turėtų būti ištrinti duomenys', async () => {
            (await knex('Book').where({ probability: 0.3 })).length.should.not.be.ok;
        });
    });
    Scenario('Trinti kai yra 2 trinamieji', async () => {
        let knex: Knex;
        let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
        const query = `mutation { removeBook(filter: {name: "1"}) }`;
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
                data: { removeBook: ['1', '2'] },
            });
        });
        And('duomenų bazėje turėtų būti ištrinti duomenys', async () => {
            (await knex('Book').where({ name: '1' })).length.should.not.be.ok;
        });
    });
    Scenario('Trinti kai trinamieji turi objiektų sąrašo esybę', async () => {
        let knex: Knex;
        let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
        const query = `mutation { removeBook }`;
        let response: request.Response;
        before(async () => {
            await createDBClient();
            const creationResult = await createApp({
                config,
                typeDefs:
                    'schema { query: Query } type Query { book: Book } type Book { authors: [Author] } type Author { name: String }',
            });
            app = creationResult.app;
            knex = creationResult.knex;
            await knex('Book').insert({});
            await knex('Author').insert({ name: 'Sam' });
            await knex('Author').insert({ name: 'Bob' });
            await knex('__Book_authors_list').insert({ Book_id: 1, Book_authors_Author_id: 1 });
            await knex('__Book_authors_list').insert({ Book_id: 1, Book_authors_Author_id: 2 });
        });

        after(async () => {
            await removeDBClient();
        });

        Given('duomenų bazėje 1 Book', async () => {
            (await knex('Book').where({ id: 1 }).first()).should.be.ok;
        });
        And('2 Authoriams', async () => {
            (await knex('Author').where({ name: 'Sam' }).first()).should.be.ok;
            (await knex('Author').where({ name: 'Bob' }).first()).should.be.ok;
        });
        And('jie yra Book authors sąraše', async () => {
            (
                await knex('__Book_authors_list')
                    .where({ Book_id: 1, Book_authors_Author_id: 1 })
                    .first()
            ).should.be.ok;
            (
                await knex('__Book_authors_list')
                    .where({ Book_id: 1, Book_authors_Author_id: 2 })
                    .first()
            ).should.be.ok;
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
        Then('atsakymo kūnas turėtų turėti teisingą atsakymą', async () => {
            response.body.should.deep.equal({
                data: { removeBook: ['1'] },
            });
        });
        And('duomenų bazėje turėtų būti ištrinti duomenys', async () => {
            (await knex('Book').select()).length.should.not.be.ok;
            (await knex('__Book_authors_list').where({ Book_id: 1 })).length.should.not.be.ok;
        });
    });
    Scenario('Trinti kai trinamieji turi skaliarų sąrašo esybę', async () => {
        let knex: Knex;
        let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
        const query = `mutation { removeBook }`;
        let response: request.Response;
        before(async () => {
            await createDBClient();
            const creationResult = await createApp({
                config,
                typeDefs:
                    'schema { query: Query } type Query { book: Book } type Book { authors: [String] }',
            });
            app = creationResult.app;
            knex = creationResult.knex;
            await knex('Book').insert({});
            await knex('__Book_authors_list').insert({ value: 'Sam', Book_id: 1 });
            await knex('__Book_authors_list').insert({ value: 'Bob', Book_id: 1 });
        });

        after(async () => {
            await removeDBClient();
        });

        Given('duomenų bazėje 1 Book', async () => {
            (await knex('Book').where({ id: 1 }).first()).should.be.ok;
        });
        And('jo authors sąraše yra 2 laukai', async () => {
            (await knex('__Book_authors_list').where({ value: 'Sam', Book_id: 1 }).first()).should
                .be.ok;
            (await knex('__Book_authors_list').where({ value: 'Bob', Book_id: 1 }).first()).should
                .be.ok;
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
        Then('atsakymo kūnas turėtų turėti teisingą atsakymą', async () => {
            response.body.should.deep.equal({
                data: { removeBook: ['1'] },
            });
        });
        And('duomenų bazėje turėtų būti ištrinti duomenys', async () => {
            (await knex('Book').select()).length.should.not.be.ok;
            (await knex('__Book_authors_list').where({ Book_id: 1 })).length.should.not.be.ok;
        });
    });
});
