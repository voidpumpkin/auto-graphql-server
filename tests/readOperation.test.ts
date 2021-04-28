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

Feature('👓Duomenų skaitymo operacijos', async () => {
    Feature('Skaliarų skaitymo operacijos kai duomenų bazėje yra prašomi duomenys', async () => {
        Scenario('Schema turi ID skaliarą', async () => {
            let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
            const query = `{ id }`;
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
                response.status.should.be.equal(200);
            });
            Then('atsakymo kūnas turėtų turėti teisingą id', async () => {
                response.body.should.deep.equal({
                    data: { id: '1' },
                });
            });
        });
        Scenario('Schema turi Int skaliarą', async () => {
            let knex: Knex;
            let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
            let response: request.Response;

            const query = `{ executionCount }`;

            before(async () => {
                await createDBClient();
                const creationResult = await createApp({
                    config,
                    typeDefs: 'schema { query: Query } type Query { executionCount: Int }',
                });
                app = creationResult.app;
                knex = creationResult.knex;
                await knex('Query').where({ id: 1 }).update({ executionCount: 1 });
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
            Then('atsakymo kūnas turėtų turėti teisingą executionCount', async () => {
                response.body.should.deep.equal({
                    data: { executionCount: 1 },
                });
            });
        });
        Scenario('Schema turi Float skaliarą', async () => {
            let knex: Knex;
            let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
            let response: request.Response;

            const query = `{ executionCount }`;

            before(async () => {
                await createDBClient();
                const creationResult = await createApp({
                    config,
                    typeDefs: 'schema { query: Query } type Query { executionCount: Float }',
                });
                app = creationResult.app;
                knex = creationResult.knex;
                await knex('Query').where({ id: 1 }).update({ executionCount: 1.2 });
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
            Then('atsakymo kūnas turėtų turėti teisingą executionCount', async () => {
                response.body.should.deep.equal({
                    data: { executionCount: 1.2 },
                });
            });
        });
        Scenario('Schema turi String skaliarą', async () => {
            let knex: Knex;
            let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
            let response: request.Response;

            const query = `{ name }`;

            before(async () => {
                await createDBClient();
                const creationResult = await createApp({
                    config,
                    typeDefs: 'schema { query: Query } type Query { name: String }',
                });
                app = creationResult.app;
                knex = creationResult.knex;
                await knex('Query').where({ id: 1 }).update({ name: 'bob' });
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
            Then('atsakymo kūnas turėtų turėti teisingą name', async () => {
                response.body.should.deep.equal({
                    data: { name: 'bob' },
                });
            });
        });
        Scenario('Schema turi Boolean skaliarą', async () => {
            let knex: Knex;
            let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
            let response: request.Response;

            const query = `{ isTrue }`;

            before(async () => {
                await createDBClient();
                const creationResult = await createApp({
                    config,
                    typeDefs: 'schema { query: Query } type Query { isTrue: Boolean }',
                });
                app = creationResult.app;
                knex = creationResult.knex;
                await knex('Query').where({ id: 1 }).update({ isTrue: true });
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
            Then('atsakymo kūnas turėtų turėti teisingą isTrue', async () => {
                response.body.should.deep.equal({
                    data: { isTrue: true },
                });
            });
        });
    });
    Feature('Skaliarų skaitymo operacijos kai duomenų bazėje nėra prašomų duomenų', async () => {
        Scenario('Schema turi ID skaliarą', async () => {
            let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
            const query = `{ bob }`;
            let response: request.Response;
            before(async () => {
                await createDBClient();
                const creationResult = await createApp({
                    config,
                    typeDefs: 'schema { query: Query } type Query { bob: ID }',
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
                response.status.should.be.equal(200);
            });
            Then('atsakymo kūnas turėtų turėti teisingą id', async () => {
                response.body.should.deep.equal({
                    data: { bob: null },
                });
            });
        });
        Scenario('Schema turi Int skaliarą', async () => {
            let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
            let response: request.Response;

            const query = `{ executionCount }`;

            before(async () => {
                await createDBClient();
                const creationResult = await createApp({
                    config,
                    typeDefs: 'schema { query: Query } type Query { executionCount: Int }',
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
                response.status.should.be.equal(200);
            });
            Then('atsakymo kūnas turėtų turėti teisingą executionCount', async () => {
                response.body.should.deep.equal({
                    data: { executionCount: null },
                });
            });
        });
        Scenario('Schema turi Float skaliarą', async () => {
            let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
            let response: request.Response;

            const query = `{ executionCount }`;

            before(async () => {
                await createDBClient();
                const creationResult = await createApp({
                    config,
                    typeDefs: 'schema { query: Query } type Query { executionCount: Float }',
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
                response.status.should.be.equal(200);
            });
            Then('atsakymo kūnas turėtų turėti teisingą executionCount', async () => {
                response.body.should.deep.equal({
                    data: { executionCount: null },
                });
            });
        });
        Scenario('Schema turi String skaliarą', async () => {
            let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
            let response: request.Response;

            const query = `{ name }`;

            before(async () => {
                await createDBClient();
                const creationResult = await createApp({
                    config,
                    typeDefs: 'schema { query: Query } type Query { name: String }',
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
                response.status.should.be.equal(200);
            });
            Then('atsakymo kūnas turėtų turėti teisingą name', async () => {
                response.body.should.deep.equal({
                    data: { name: null },
                });
            });
        });
        Scenario('Schema turi Boolean skaliarą', async () => {
            let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
            let response: request.Response;

            const query = `{ isTrue }`;

            before(async () => {
                await createDBClient();
                const creationResult = await createApp({
                    config,
                    typeDefs: 'schema { query: Query } type Query { isTrue: Boolean }',
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
                response.status.should.be.equal(200);
            });
            Then('atsakymo kūnas turėtų turėti teisingą isTrue', async () => {
                response.body.should.deep.equal({
                    data: { isTrue: null },
                });
            });
        });
    });
    Feature('Objiektų skaitymo operacijos kai duomenų bazėje yra prašomi duomenys', async () => {
        Scenario('Schema turi book Book objiektą', async () => {
            let knex: Knex;
            let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
            let response: request.Response;
            const query = `{ book{ id } }`;

            before(async () => {
                await createDBClient();
                const creationResult = await createApp({
                    config,
                    typeDefs:
                        'schema { query: Query } type Query { book: Book } type Book { identification: ID }',
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
            And(`duomenų bazėje yra 2 Book sujungtos su Query objiektu`, async () => {
                await knex('Book').insert({});
                await knex('Book').insert({});
                await knex('Query').where({ id: 1 }).update({ book: 2 });
            });
            When('atsakymas gražinamas', async () => {
                response = await request(app.listen())
                    .post(`/`)
                    .set('Accept', 'application/json')
                    .send({ query });
                response.status.should.be.equal(200);
            });
            Then('atsakymo kūnas turėtų turėti teisingą book id', async () => {
                response.body.should.deep.equal({
                    data: { book: { id: '2' } },
                });
            });
        });
        Scenario('Schema yra 3 objiektų gylio', async () => {
            let knex: Knex;
            let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
            let response: request.Response;
            const query = `{ book{ title{ short } } }`;

            before(async () => {
                await createDBClient();
                const creationResult = await createApp({
                    config,
                    typeDefs:
                        'schema { query: Query } type Query { book: Book } type Book { title: Title } type Title { short: String }',
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
            And(`duomenų bazėje yra 2 Title objiektai su esybe short String`, async () => {
                await knex('Title').insert({ short: 'GOT' });
                await knex('Title').insert({ short: 'LOTR' });
            });
            And(
                `jie yra prijungti prie atskiru Book objiektų sujungtų su Query objiektu`,
                async () => {
                    await knex('Book').insert({ title: 1 });
                    await knex('Book').insert({ title: 2 });
                    await knex('Query').where({ id: 1 }).update({ book: 2 });
                }
            );
            When('atsakymas gražinamas', async () => {
                response = await request(app.listen())
                    .post(`/`)
                    .set('Accept', 'application/json')
                    .send({ query });
                response.status.should.be.equal(200);
            });
            Then('atsakymo kūnas turėtų turėti teisingą book title short', async () => {
                response.body.should.deep.equal({
                    data: { book: { title: { short: 'LOTR' } } },
                });
            });
        });
        Scenario('Gauti book be ryšio su Query pagal book desc ', async () => {
            let knex: Knex;
            let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
            let response: request.Response;
            const query = `{ book(filter: { desc: "aaa" }){ name } }`;

            before(async () => {
                await createDBClient();
                const creationResult = await createApp({
                    config,
                    typeDefs:
                        'schema { query: Query } type Query { book: Book } type Book { name: String desc: String }',
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
            And(`duomenų bazėje yra 4 Book, viena sujungta su Query objiektu`, async () => {
                await knex('Book').insert({});
                await knex('Book').insert({ name: 'bob', desc: 'aaa' });
                await knex('Book').insert({ name: 'sam', desc: 'zzz' });
                await knex('Query').where({ id: 1 }).update({ book: 3 });
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
                    data: { book: null },
                });
            });
        });
        Scenario('Gauti book su ryšiu su Query pagal book id ', async () => {
            let knex: Knex;
            let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
            let response: request.Response;
            const query = `{ book(filter: { desc: "aaa" }){ name } }`;

            before(async () => {
                await createDBClient();
                const creationResult = await createApp({
                    config,
                    typeDefs:
                        'schema { query: Query } type Query { book: Book } type Book { name: String desc: String }',
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
            And(`duomenų bazėje yra 4 Book, viena sujungta su Query objiektu`, async () => {
                await knex('Book').insert({});
                await knex('Book').insert({ name: 'bob', desc: 'aaa' });
                await knex('Book').insert({ name: 'sam', desc: 'zzz' });
                await knex('Query').where({ id: 1 }).update({ book: 2 });
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
                    data: { book: { name: 'bob' } },
                });
            });
        });
    });
    Feature('Objiektų skaitymo operacijos kai duomenų bazėje nėra prašomų duomenų', async () => {
        Scenario('Schema turi book Book objiektą', async () => {
            let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
            let response: request.Response;
            const query = `{ book{ id } }`;

            before(async () => {
                await createDBClient();
                const creationResult = await createApp({
                    config,
                    typeDefs:
                        'schema { query: Query } type Query { book: Book } type Book { identification: ID }',
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
                response.status.should.be.equal(200);
            });
            Then('atsakymo kūnas turėtų turėti teisingą book id', async () => {
                response.body.should.deep.equal({
                    data: { book: null },
                });
            });
        });
        Scenario(
            'Schema yra 3 objiektų gylio ir duomenų bazėje nėra trečio gylio objiekto',
            async () => {
                let knex: Knex;
                let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
                let response: request.Response;
                const query = `{ book{ title{ short } } }`;

                before(async () => {
                    await createDBClient();
                    const creationResult = await createApp({
                        config,
                        typeDefs:
                            'schema { query: Query } type Query { book: Book } type Book { title: Title } type Title { short: String }',
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
                And(`duomenų bazėje yra 2 Book objiektai sujungti su Query objiektu`, async () => {
                    await knex('Book').insert({});
                    await knex('Book').insert({});
                    await knex('Query').where({ id: 1 }).update({ book: 2 });
                });
                When('atsakymas gražinamas', async () => {
                    response = await request(app.listen())
                        .post(`/`)
                        .set('Accept', 'application/json')
                        .send({ query });
                    response.status.should.be.equal(200);
                });
                Then('atsakymo kūnas turėtų turėti teisingą book title short', async () => {
                    response.body.should.deep.equal({
                        data: { book: { title: null } },
                    });
                });
            }
        );
        Scenario(
            'Schema yra 3 objiektų gylio ir duomenų bazėje nėra antro gylio objiekto',
            async () => {
                let knex: Knex;
                let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
                let response: request.Response;
                const query = `{ book{ title{ short } } }`;

                before(async () => {
                    await createDBClient();
                    const creationResult = await createApp({
                        config,
                        typeDefs:
                            'schema { query: Query } type Query { book: Book } type Book { title: Title } type Title { short: String }',
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
                And(`duomenų bazėje yra Query objiektas `, async () => {
                    (await knex('Query').where({ id: 1 }).first()).should.be.ok;
                });
                When('atsakymas gražinamas', async () => {
                    response = await request(app.listen())
                        .post(`/`)
                        .set('Accept', 'application/json')
                        .send({ query });
                    response.status.should.be.equal(200);
                });
                Then('atsakymo kūnas turėtų turėti teisingą book title short', async () => {
                    response.body.should.deep.equal({
                        data: { book: null },
                    });
                });
            }
        );
    });
    Feature('Sarašų skaitymo operacijos kai duomenų bazėje yra prašomi duomenys', async () => {
        Scenario('Schemoje query objiektas turi skaliarinį sąrašą', async () => {
            let knex: Knex;
            let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
            let response: request.Response;
            const query = `{ ids }`;

            before(async () => {
                await createDBClient();
                const creationResult = await createApp({
                    config,
                    typeDefs: 'schema { query: Query } type Query { ids: [ID] }',
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
            And(`duomenų bazėje yra 2 Query id`, async () => {
                await knex('__Query_ids_list').insert({ value: 1, Query_id: 1 });
                await knex('__Query_ids_list').insert({ value: 2, Query_id: 1 });
            });
            When('atsakymas gražinamas', async () => {
                response = await request(app.listen())
                    .post(`/`)
                    .set('Accept', 'application/json')
                    .send({ query });
                response.status.should.be.equal(200);
            });
            Then('atsakymo kūnas turėtų turėti teisingą ids sąraša', async () => {
                response.body.should.deep.equal({
                    data: { ids: ['1', '2'] },
                });
            });
        });
        Scenario('Schemoje query objiektas turi objiektų sąrašą', async () => {
            let knex: Knex;
            let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
            let response: request.Response;
            const query = `{ books{ id } }`;

            before(async () => {
                await createDBClient();
                const creationResult = await createApp({
                    config,
                    typeDefs:
                        'schema { query: Query } type Query { books: [Book] } type Book { identification: ID }',
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
            And(`duomenų bazėje yra 2 Book sujungti su Query`, async () => {
                await knex('Book').insert({ identification: 1 });
                await knex('Book').insert({ identification: 1 });
                await knex('__Query_books_list').insert({ Query_id: 1, Query_books_Book_id: 1 });
                await knex('__Query_books_list').insert({ Query_id: 1, Query_books_Book_id: 2 });
            });
            When('atsakymas gražinamas', async () => {
                response = await request(app.listen())
                    .post(`/`)
                    .set('Accept', 'application/json')
                    .send({ query });
                response.status.should.be.equal(200);
            });
            Then('atsakymo kūnas turėtų turėti teisingą books sąrašą', async () => {
                response.body.should.deep.equal({
                    data: { books: [{ id: '1' }, { id: '2' }] },
                });
            });
        });
        Scenario(
            'Schemoje query objiektas turi objiektų sąrašą kurie turi po objiektą',
            async () => {
                let knex: Knex;
                let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
                let response: request.Response;
                const query = `{ books{ author{ name } } }`;

                before(async () => {
                    await createDBClient();
                    const creationResult = await createApp({
                        config,
                        typeDefs:
                            'schema { query: Query } type Query { books: [Book] } type Book { author: Author } type Author { name: String }',
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
                And(`duomenų bazėje yra 2 Author`, async () => {
                    await knex('Author').insert({ name: 'Sam' });
                    await knex('Author').insert({ name: 'Bob' });
                });
                And(
                    `2 Book kurios turi po 1 Author ir yra prijuntos prie Query objiekto`,
                    async () => {
                        await knex('Book').insert({ author: 1 });
                        await knex('Book').insert({ author: 2 });
                        await knex('__Query_books_list').insert({
                            Query_id: 1,
                            Query_books_Book_id: 1,
                        });
                        await knex('__Query_books_list').insert({
                            Query_id: 1,
                            Query_books_Book_id: 2,
                        });
                    }
                );
                When('atsakymas gražinamas', async () => {
                    response = await request(app.listen())
                        .post(`/`)
                        .set('Accept', 'application/json')
                        .send({ query });
                    response.status.should.be.equal(200);
                });
                Then('atsakymo kūnas turėtų turėti teisingą books sąrašą', async () => {
                    response.body.should.deep.equal({
                        data: {
                            books: [{ author: { name: 'Sam' } }, { author: { name: 'Bob' } }],
                        },
                    });
                });
            }
        );
        Scenario(
            'Schemoje query objiektas turi objiektų sąrašą kurie turi objietų sąrašą',
            async () => {
                let knex: Knex;
                let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
                let response: request.Response;
                const query = `{ books{ authors{ name } } }`;

                before(async () => {
                    await createDBClient();
                    const creationResult = await createApp({
                        config,
                        typeDefs:
                            'schema { query: Query } type Query { books: [Book] } type Book { authors: [Author] } type Author { name: String }',
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
                And(`duomenų bazėje yra 2 Book sujungtos su Query`, async () => {
                    await knex('Book').insert({});
                    await knex('Book').insert({});
                    await knex('__Query_books_list').insert({
                        Query_id: 1,
                        Query_books_Book_id: 1,
                    });
                    await knex('__Query_books_list').insert({
                        Query_id: 1,
                        Query_books_Book_id: 2,
                    });
                });
                And(`4 Author, po 2 sujunti su skirtinga Book`, async () => {
                    await knex('Author').insert({ name: 'Sam' });
                    await knex('Author').insert({ name: 'Bob' });
                    await knex('Author').insert({ name: 'Fab' });
                    await knex('Author').insert({ name: 'Holoman' });
                    await knex('__Book_authors_list').insert({
                        Book_id: 2,
                        Book_authors_Author_id: 1,
                    });
                    await knex('__Book_authors_list').insert({
                        Book_id: 2,
                        Book_authors_Author_id: 2,
                    });
                    await knex('__Book_authors_list').insert({
                        Book_id: 1,
                        Book_authors_Author_id: 3,
                    });
                    await knex('__Book_authors_list').insert({
                        Book_id: 1,
                        Book_authors_Author_id: 4,
                    });
                });
                When('atsakymas gražinamas', async () => {
                    response = await request(app.listen())
                        .post(`/`)
                        .set('Accept', 'application/json')
                        .send({ query });
                    response.status.should.be.equal(200);
                });
                Then('atsakymo kūnas turėtų turėti teisingą books sąrašą', async () => {
                    response.body.should.deep.equal({
                        data: {
                            books: [
                                { authors: [{ name: 'Fab' }, { name: 'Holoman' }] },
                                { authors: [{ name: 'Sam' }, { name: 'Bob' }] },
                            ],
                        },
                    });
                });
            }
        );
        Scenario(
            'Schemoje query objiektas turi book objiektą kuris turi objietų sąrašą',
            async () => {
                let knex: Knex;
                let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
                let response: request.Response;
                const query = `{ book{ authors{ name } } }`;

                before(async () => {
                    await createDBClient();
                    const creationResult = await createApp({
                        config,
                        typeDefs:
                            'schema { query: Query } type Query { book: Book } type Book { authors: [Author] } type Author { name: String }',
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
                And(`duomenų bazėje yra Book sujungta su Query`, async () => {
                    await knex('Book').insert({});
                    await knex('Query').where({ id: 1 }).update({ book: 1 });
                });
                And(`2 Author sujunti su Book`, async () => {
                    await knex('Author').insert({ name: 'Fab' });
                    await knex('Author').insert({ name: 'Holoman' });
                    await knex('__Book_authors_list').insert({
                        Book_id: 1,
                        Book_authors_Author_id: 1,
                    });
                    await knex('__Book_authors_list').insert({
                        Book_id: 1,
                        Book_authors_Author_id: 2,
                    });
                });
                When('atsakymas gražinamas', async () => {
                    response = await request(app.listen())
                        .post(`/`)
                        .set('Accept', 'application/json')
                        .send({ query });
                    response.status.should.be.equal(200);
                });
                Then('atsakymo kūnas turėtų turėti teisingą books sąrašą', async () => {
                    response.body.should.deep.equal({
                        data: {
                            book: {
                                authors: [{ name: 'Fab' }, { name: 'Holoman' }],
                            },
                        },
                    });
                });
            }
        );
        Scenario('Gauti books pagal Query ryšį ir name', async () => {
            let knex: Knex;
            let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
            let response: request.Response;
            const query = `{ books(filter: {name: "bob"}){ id } }`;

            before(async () => {
                await createDBClient();
                const creationResult = await createApp({
                    config,
                    typeDefs:
                        'schema { query: Query } type Query { books: [Book] } type Book { name: String }',
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
            And(`duomenų bazėje yra 2 Book sujungti su Query`, async () => {
                await knex('Book').insert({ name: 'ggg' });
                await knex('Book').insert({ name: 'bob' });
                await knex('Book').insert({ name: 'aaa' });
                await knex('Book').insert({ name: 'bob' });
                await knex('__Query_books_list').insert({ Query_id: 1, Query_books_Book_id: 1 });
                await knex('__Query_books_list').insert({ Query_id: 1, Query_books_Book_id: 2 });
                await knex('__Query_books_list').insert({ Query_id: 1, Query_books_Book_id: 3 });
            });
            When('atsakymas gražinamas', async () => {
                response = await request(app.listen())
                    .post(`/`)
                    .set('Accept', 'application/json')
                    .send({ query });
                response.status.should.be.equal(200);
            });
            Then('atsakymo kūnas turėtų turėti teisingą books sąrašą', async () => {
                response.body.should.deep.equal({
                    data: { books: [{ id: '2' }] },
                });
            });
        });
    });
    Feature('Sarašų skaitymo operacijos kai duomenų bazėje nėra prašomų duomenų', async () => {
        Scenario('Schemoje query objiektas turi skaliarinį sąrašą', async () => {
            let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
            let response: request.Response;
            const query = `{ ids }`;

            before(async () => {
                await createDBClient();
                const creationResult = await createApp({
                    config,
                    typeDefs: 'schema { query: Query } type Query { ids: [ID] }',
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
                response.status.should.be.equal(200);
            });
            Then('atsakymo kūnas turėtų turėti teisingą ids sąrašą', async () => {
                response.body.should.deep.equal({
                    data: { ids: [] },
                });
            });
        });
        Scenario(
            'Schemoje query objiektas turi objiektų sąrašą kurie duomenų bazėje neturi duomenų',
            async () => {
                let knex: Knex;
                let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
                let response: request.Response;
                const query = `{ books{ bob } }`;

                before(async () => {
                    await createDBClient();
                    const creationResult = await createApp({
                        config,
                        typeDefs:
                            'schema { query: Query } type Query { books: [Book] } type Book { bob: ID }',
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
                And(`duomenų bazėje yra 2 Book sujungti su Query`, async () => {
                    await knex('Book').insert({});
                    await knex('Book').insert({});
                    await knex('__Query_books_list').insert({
                        Query_id: 1,
                        Query_books_Book_id: 1,
                    });
                    await knex('__Query_books_list').insert({
                        Query_id: 1,
                        Query_books_Book_id: 2,
                    });
                });
                When('atsakymas gražinamas', async () => {
                    response = await request(app.listen())
                        .post(`/`)
                        .set('Accept', 'application/json')
                        .send({ query });
                    response.status.should.be.equal(200);
                });
                Then('atsakymo kūnas turėtų turėti teisingą books sąrašą', async () => {
                    response.body.should.deep.equal({
                        data: { books: [{ bob: null }, { bob: null }] },
                    });
                });
            }
        );
        Scenario(
            'Schemoje query objiektas turi objiektų sąrašą kurie nėra duomenų bazėje',
            async () => {
                let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
                let response: request.Response;
                const query = `{ books{ bob } }`;

                before(async () => {
                    await createDBClient();
                    const creationResult = await createApp({
                        config,
                        typeDefs:
                            'schema { query: Query } type Query { books: [Book] } type Book { bob: ID }',
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
                    response.status.should.be.equal(200);
                });
                Then('atsakymo kūnas turėtų turėti teisingą books sąrašą', async () => {
                    response.body.should.deep.equal({
                        data: { books: [] },
                    });
                });
            }
        );
        Scenario(
            'Schemoje query objiektas turi objiektų sąrašą kurie turi objietų sąrašą bet tik pirmas objiektas yra duomenų bazėje',
            async () => {
                let knex: Knex;
                let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
                let response: request.Response;
                const query = `{ books{ authors{ name } } }`;

                before(async () => {
                    await createDBClient();
                    const creationResult = await createApp({
                        config,
                        typeDefs:
                            'schema { query: Query } type Query { books: [Book] } type Book { authors: [Author] } type Author { name: String }',
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
                And(`duomenų bazėje yra 2 Book sujungtos su Query`, async () => {
                    await knex('Book').insert({});
                    await knex('Book').insert({});
                    await knex('__Query_books_list').insert({
                        Query_id: 1,
                        Query_books_Book_id: 1,
                    });
                    await knex('__Query_books_list').insert({
                        Query_id: 1,
                        Query_books_Book_id: 2,
                    });
                });
                When('atsakymas gražinamas', async () => {
                    response = await request(app.listen())
                        .post(`/`)
                        .set('Accept', 'application/json')
                        .send({ query });
                    response.status.should.be.equal(200);
                });
                Then('atsakymo kūnas turėtų turėti teisingą books sąrašą', async () => {
                    response.body.should.deep.equal({
                        data: {
                            books: [{ authors: [] }, { authors: [] }],
                        },
                    });
                });
            }
        );
    });
});
