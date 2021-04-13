import request from 'supertest';
import { should } from 'chai';
import 'mocha-cakes-2';

import Knex from 'knex';
import Koa from 'koa';

import { createApp } from '../src/createApp';
import { getSourceSchema } from '../src/schema/getSourceSchema';
import config from './testConfig.json';

should();

Feature('👓Skaitymo operacijos', async () => {
    Feature('Skaliarų skaitymo operacijos kai duomenų bazėje yra prašomi duomenys', async () => {
        Scenario('Schema turi ID skaliarą', async () => {
            let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
            const query = `{ id }`;
            let response: request.Response;
            before(async () => {
                const sourceSchema = getSourceSchema({
                    typeDefs: `schema { query: Query } type Query { id: ID }`,
                });
                const creationResult = await createApp({ config, sourceSchema });
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
                const sourceSchema = getSourceSchema({
                    typeDefs: `schema { query: Query } type Query { executionCount: Int }`,
                });
                const creationResult = await createApp({ config, sourceSchema });
                app = creationResult.app;
                knex = creationResult.knex;
                await knex('Query').where({ id: 1 }).update({ executionCount: 1 });
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
                const sourceSchema = getSourceSchema({
                    typeDefs: `schema { query: Query } type Query { executionCount: Float }`,
                });
                const creationResult = await createApp({ config, sourceSchema });
                app = creationResult.app;
                knex = creationResult.knex;
                await knex('Query').where({ id: 1 }).update({ executionCount: 1.2 });
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
                const sourceSchema = getSourceSchema({
                    typeDefs: `schema { query: Query } type Query { name: String }`,
                });
                const creationResult = await createApp({ config, sourceSchema });
                app = creationResult.app;
                knex = creationResult.knex;
                await knex('Query').where({ id: 1 }).update({ name: 'bob' });
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
                const sourceSchema = getSourceSchema({
                    typeDefs: `schema { query: Query } type Query { isTrue: Boolean }`,
                });
                const creationResult = await createApp({ config, sourceSchema });
                app = creationResult.app;
                knex = creationResult.knex;
                await knex('Query').where({ id: 1 }).update({ isTrue: true });
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
                const sourceSchema = getSourceSchema({
                    typeDefs: `schema { query: Query } type Query { bob: ID }`,
                });
                const creationResult = await createApp({ config, sourceSchema });
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
                const sourceSchema = getSourceSchema({
                    typeDefs: `schema { query: Query } type Query { executionCount: Int }`,
                });
                const creationResult = await createApp({ config, sourceSchema });
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
                const sourceSchema = getSourceSchema({
                    typeDefs: `schema { query: Query } type Query { executionCount: Float }`,
                });
                const creationResult = await createApp({ config, sourceSchema });
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
                const sourceSchema = getSourceSchema({
                    typeDefs: `schema { query: Query } type Query { name: String }`,
                });
                const creationResult = await createApp({ config, sourceSchema });
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
                const sourceSchema = getSourceSchema({
                    typeDefs: `schema { query: Query } type Query { isTrue: Boolean }`,
                });
                const creationResult = await createApp({ config, sourceSchema });
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
                const sourceSchema = getSourceSchema({
                    typeDefs: `schema { query: Query } type Query { book: Book } type Book { id: ID }`,
                });
                const creationResult = await createApp({ config, sourceSchema });
                app = creationResult.app;
                knex = creationResult.knex;
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
                const sourceSchema = getSourceSchema({
                    typeDefs: `schema { query: Query } type Query { book: Book } type Book { title: Title } type Title { short: String }`,
                });
                const creationResult = await createApp({ config, sourceSchema });
                app = creationResult.app;
                knex = creationResult.knex;
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
    });
    Feature('Objiektų skaitymo operacijos kai duomenų bazėje nėra prašomų duomenų', async () => {
        Scenario('Schema turi book Book objiektą', async () => {
            let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
            let response: request.Response;
            const query = `{ book{ id } }`;

            before(async () => {
                const sourceSchema = getSourceSchema({
                    typeDefs: `schema { query: Query } type Query { book: Book } type Book { id: ID }`,
                });
                const creationResult = await createApp({ config, sourceSchema });
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
                    const sourceSchema = getSourceSchema({
                        typeDefs: `schema { query: Query } type Query { book: Book } type Book { title: Title } type Title { short: String }`,
                    });
                    const creationResult = await createApp({ config, sourceSchema });
                    app = creationResult.app;
                    knex = creationResult.knex;
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
                    const sourceSchema = getSourceSchema({
                        typeDefs: `schema { query: Query } type Query { book: Book } type Book { title: Title } type Title { short: String }`,
                    });
                    const creationResult = await createApp({ config, sourceSchema });
                    app = creationResult.app;
                    knex = creationResult.knex;
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
                const sourceSchema = getSourceSchema({
                    typeDefs: `schema { query: Query } type Query { ids: [ID] } `,
                });
                const creationResult = await createApp({ config, sourceSchema });
                app = creationResult.app;
                knex = creationResult.knex;
            });

            Given(`užklausai "${query}"`, () => {
                query.should.exist;
            });
            And(`duomenų bazėje yra 2 Query id`, async () => {
                await knex('__Query_ids_list').insert({ value: 1, __Query_id: 1 });
                await knex('__Query_ids_list').insert({ value: 2, __Query_id: 1 });
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
                const sourceSchema = getSourceSchema({
                    typeDefs: `schema { query: Query } type Query { books: [Book] } type Book { id: ID }`,
                });
                const creationResult = await createApp({ config, sourceSchema });
                app = creationResult.app;
                knex = creationResult.knex;
            });

            Given(`užklausai "${query}"`, () => {
                query.should.exist;
            });
            And(`duomenų bazėje yra 2 Book sujungti su Query`, async () => {
                await knex('Book').insert({ __Query_id: 1 });
                await knex('Book').insert({ __Query_id: 1 });
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
                    const sourceSchema = getSourceSchema({
                        typeDefs: `schema { query: Query } type Query { books: [Book] } type Book { author: Author } type Author { name: String }`,
                    });
                    const creationResult = await createApp({ config, sourceSchema });
                    app = creationResult.app;
                    knex = creationResult.knex;
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
                        await knex('Book').insert({ __Query_id: 1, author: 1 });
                        await knex('Book').insert({ __Query_id: 1, author: 2 });
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
                    const sourceSchema = getSourceSchema({
                        typeDefs: `schema { query: Query } type Query { books: [Book] } type Book { authors: [Author] } type Author { name: String }`,
                    });
                    const creationResult = await createApp({ config, sourceSchema });
                    app = creationResult.app;
                    knex = creationResult.knex;
                });

                Given(`užklausai "${query}"`, () => {
                    query.should.exist;
                });
                And(`duomenų bazėje yra 2 Book sujungtos su Query`, async () => {
                    await knex('Book').insert({ __Query_id: 1 });
                    await knex('Book').insert({ __Query_id: 1 });
                });
                And(`4 Author, po 2 sujunti su skirtinga Book`, async () => {
                    await knex('Author').insert({ name: 'Sam', __Book_id: 2 });
                    await knex('Author').insert({ name: 'Bob', __Book_id: 2 });
                    await knex('Author').insert({ name: 'Fab', __Book_id: 1 });
                    await knex('Author').insert({ name: 'Holoman', __Book_id: 1 });
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
                    const sourceSchema = getSourceSchema({
                        typeDefs: `schema { query: Query } type Query { book: Book } type Book { authors: [Author] } type Author { name: String }`,
                    });
                    const creationResult = await createApp({ config, sourceSchema });
                    app = creationResult.app;
                    knex = creationResult.knex;
                });

                Given(`užklausai "${query}"`, () => {
                    query.should.exist;
                });
                And(`duomenų bazėje yra Book sujungta su Query`, async () => {
                    await knex('Book').insert({});
                    await knex('Query').where({ id: 1 }).update({ book: 1 });
                });
                And(`2 Author sujunti su Book`, async () => {
                    await knex('Author').insert({ name: 'Fab', __Book_id: 1 });
                    await knex('Author').insert({ name: 'Holoman', __Book_id: 1 });
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
    });
    Feature('Sarašų skaitymo operacijos kai duomenų bazėje nėra prašomų duomenų', async () => {
        Scenario('Schemoje query objiektas turi skaliarinį sąrašą', async () => {
            let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
            let response: request.Response;
            const query = `{ ids }`;

            before(async () => {
                const sourceSchema = getSourceSchema({
                    typeDefs: `schema { query: Query } type Query { ids: [ID] } `,
                });
                const creationResult = await createApp({ config, sourceSchema });
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
                    const sourceSchema = getSourceSchema({
                        typeDefs: `schema { query: Query } type Query { books: [Book] } type Book { bob: ID }`,
                    });
                    const creationResult = await createApp({ config, sourceSchema });
                    app = creationResult.app;
                    knex = creationResult.knex;
                });

                Given(`užklausai "${query}"`, () => {
                    query.should.exist;
                });
                And(`duomenų bazėje yra 2 Book sujungti su Query`, async () => {
                    await knex('Book').insert({ __Query_id: 1 });
                    await knex('Book').insert({ __Query_id: 1 });
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
                    const sourceSchema = getSourceSchema({
                        typeDefs: `schema { query: Query } type Query { books: [Book] } type Book { bob: ID }`,
                    });
                    const creationResult = await createApp({ config, sourceSchema });
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
                    const sourceSchema = getSourceSchema({
                        typeDefs: `schema { query: Query } type Query { books: [Book] } type Book { authors: [Author] } type Author { name: String }`,
                    });
                    const creationResult = await createApp({ config, sourceSchema });
                    app = creationResult.app;
                    knex = creationResult.knex;
                });

                Given(`užklausai "${query}"`, () => {
                    query.should.exist;
                });
                And(`duomenų bazėje yra 2 Book sujungtos su Query`, async () => {
                    await knex('Book').insert({ __Query_id: 1 });
                    await knex('Book').insert({ __Query_id: 1 });
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
