import request from 'supertest';
import { should } from 'chai';
import 'mocha-cakes-2';

import Knex from 'knex';
import Koa from 'koa';

import { createApp } from '../src/createApp';
import { getResolverlessSchema } from '../src/getResolverlessSchema/getResolverlessSchema';
import config from './testConfig.json';

should();

Feature('💾Duomenų pridėjimo operacijos', async () => {
    Feature('Skaliarų pridėjimo į duomenų bazę operacijos', async () => {
        Scenario('Query turi ID skaliarą', async () => {
            let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
            const query = `mutation { addQuery(input: {id: "2"}) { id } }`;
            let response: request.Response;
            before(async () => {
                const resolverlessSchema = getResolverlessSchema({
                    typeDefs: `schema { query: Query } type Query { id: ID }`,
                });
                const creationResult = await createApp({
                    config,
                    resolverlessSchema,
                });
                app = creationResult.app;
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
                'atsakymo kūnas turėtų turėti klaidų, nes query pridejimo operacija draudžiama',
                async () => {
                    response.body.errors.length.should.be.ok;
                }
            );
        });
        Scenario('Schemos Book tipas turi ID skaliarą', async () => {
            let knex: Knex;
            let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
            const query = `mutation { addBook(input: {id: "1"}) { id } }`;
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
            Then('atsakymo kūnas turėtų turėti teisingą id', async () => {
                response.body.should.deep.equal({
                    data: { addBook: { id: '1' } },
                });
            });
            And('duomenų bazėje turėtų būti nauji duomenys', async () => {
                (await knex('Book').where({ id: '1' }).first()).should.be.ok;
            });
        });
        Scenario('Schemos Book tipas turi String skaliarą', async () => {
            let knex: Knex;
            let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
            const query = `mutation { addBook(input: {name: "Game of thrones"}) { name } }`;
            let response: request.Response;
            before(async () => {
                const resolverlessSchema = getResolverlessSchema({
                    typeDefs: `schema { query: Query } type Query { book: Book } type Book { name: String }`,
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
            Then('atsakymo kūnas turėtų turėti teisingą name', async () => {
                response.body.should.deep.equal({
                    data: { addBook: { name: 'Game of thrones' } },
                });
            });
            And('duomenų bazėje turėtų būti nauji duomenys', async () => {
                (await knex('Book').where({ name: 'Game of thrones' }).first()).should.be.ok;
            });
        });
        Scenario('Schemos Book tipas turi Boolean skaliarą', async () => {
            let knex: Knex;
            let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
            const query = `mutation { addBook(input: {named: true }) { named } }`;
            let response: request.Response;
            before(async () => {
                const resolverlessSchema = getResolverlessSchema({
                    typeDefs: `schema { query: Query } type Query { book: Book } type Book { named: Boolean }`,
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
            Then('atsakymo kūnas turėtų turėti teisingą named', async () => {
                response.body.should.deep.equal({
                    data: { addBook: { named: true } },
                });
            });
            And('duomenų bazėje turėtų būti nauji duomenys', async () => {
                (await knex('Book').where({ named: true }).first()).should.be.ok;
            });
        });
        Scenario('Schemos Book tipas turi Int skaliarą', async () => {
            let knex: Knex;
            let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
            const query = `mutation { addBook(input: {probability: 2}) { probability } }`;
            let response: request.Response;
            before(async () => {
                const resolverlessSchema = getResolverlessSchema({
                    typeDefs: `schema { query: Query } type Query { book: Book } type Book { probability: Int }`,
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
            Then('atsakymo kūnas turėtų turėti teisingą probability', async () => {
                response.body.should.deep.equal({
                    data: { addBook: { probability: 2 } },
                });
            });
            And('duomenų bazėje turėtų būti nauji duomenys', async () => {
                (await knex('Book').where({ probability: 2 }).first()).should.be.ok;
            });
        });
        Scenario('Schemos Book tipas turi Float skaliarą', async () => {
            let knex: Knex;
            let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
            const query = `mutation { addBook(input: {probability: 2.2}) { probability } }`;
            let response: request.Response;
            before(async () => {
                const resolverlessSchema = getResolverlessSchema({
                    typeDefs: `schema { query: Query } type Query { book: Book } type Book { probability: Float }`,
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
            Then('atsakymo kūnas turėtų turėti teisingą probability', async () => {
                response.body.should.deep.equal({
                    data: { addBook: { probability: 2.2 } },
                });
            });
            And('duomenų bazėje turėtų būti nauji duomenys', async () => {
                (await knex('Book').where({ probability: 2.2 }).first()).should.be.ok;
            });
        });
    });
    Feature('Sarašų ir objiketų pridėjimo į duomenų bazę operacijos', async () => {
        Scenario('Schemos Query tipas turi Book sąrašą', async () => {
            let knex: Knex;
            let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
            const query = `mutation { addBook(input: {probability: 2.2}) { probability } }`;
            let response: request.Response;
            before(async () => {
                const resolverlessSchema = getResolverlessSchema({
                    typeDefs: `schema { query: Query } type Query { books: [Book] } type Book { probability: Float }`,
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
            Then('atsakymo kūnas turėtų turėti teisingą probability', async () => {
                response.body.should.deep.equal({
                    data: { addBook: { probability: 2.2 } },
                });
            });
            And('duomenų bazėje turėtų būti nauji duomenys', async () => {
                (await knex('Book').where({ probability: 2.2 }).first()).should.be.ok;
            });
        });
        Scenario('Schemos Query tipas turi Book tipą kuris turi kitą sąrašą', async () => {
            let knex: Knex;
            let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
            const query = `mutation { addBook(input: {authors: ["1"]}) { authors { name } } }`;
            let response: request.Response;
            before(async () => {
                const resolverlessSchema = getResolverlessSchema({
                    typeDefs: `schema { query: Query } type Query { books: Book } type Book { authors: [Author] } type Author { name: String }`,
                });
                const creationResult = await createApp({
                    config,
                    resolverlessSchema,
                });
                app = creationResult.app;
                knex = creationResult.knex;
                await knex('Author').insert({ name: 'Bob' });
            });

            Given(`autorius su id 1 jau yra duomenų bazėje"`, async () => {
                const author = await knex('Author').where({ name: 'Bob' }).first();
                author.should.be.ok;
                author.id.should.be.equal(1);
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
            Then('atsakymo kūnas turėtų turėti teisingą probability', async () => {
                response.body.should.deep.equal({
                    data: { addBook: { authors: [{ name: 'Bob' }] } },
                });
            });
            And('duomenų bazėje turėtų būti nauji duomenys', async () => {
                (await knex('Book').where({ id: 1 }).first()).should.be.ok;
            });
        });
        Scenario('Schemos Query tipas turi Book tipą kuris turi skaliarini sąrašą', async () => {
            let knex: Knex;
            let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
            const query = `mutation { addBook(input: {authors: ["Bob"]}) { authors } }`;
            let response: request.Response;
            before(async () => {
                const resolverlessSchema = getResolverlessSchema({
                    typeDefs: `schema { query: Query } type Query { books: Book } type Book { authors: [String] }`,
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
            Then('atsakymo kūnas turėtų turėti teisingą probability', async () => {
                response.body.should.deep.equal({
                    data: { addBook: { authors: ['Bob'] } },
                });
            });
            And('duomenų bazėje turėtų būti nauji duomenys', async () => {
                (
                    await knex('__Book_authors_list')
                        .where({ value: 'Bob', ['__Book_id']: 1 })
                        .first()
                ).should.be.ok;
            });
        });
        Scenario('Schemos Query tipas turi Book tipą kuris turi Author', async () => {
            let knex: Knex;
            let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
            const query = `mutation { addBook(input: {author: "1"}) { author { name } } }`;
            let response: request.Response;
            before(async () => {
                const resolverlessSchema = getResolverlessSchema({
                    typeDefs: `schema { query: Query } type Query { book: Book } type Book { author: Author } type Author { name: String }`,
                });
                const creationResult = await createApp({
                    config,
                    resolverlessSchema,
                });
                app = creationResult.app;
                knex = creationResult.knex;
                await knex('Author').insert({ name: 'Bob' });
            });

            Given(`autorius su id 1 jau yra duomenų bazėje"`, async () => {
                const author = await knex('Author').where({ name: 'Bob' }).first();
                author.should.be.ok;
                author.id.should.be.equal(1);
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
            Then('atsakymo kūnas turėtų turėti teisingą probability', async () => {
                response.body.should.deep.equal({
                    data: { addBook: { author: { name: 'Bob' } } },
                });
            });
            And('duomenų bazėje turėtų būti nauji duomenys', async () => {
                (await knex('Book').where({ author: 1 }).first()).should.be.ok;
            });
        });
    });
});
