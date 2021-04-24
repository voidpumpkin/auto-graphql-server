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

Feature('💼Klieto duoti išsprendėjai', async () => {
    Scenario('Kliento išsprendėjas Query typeCount', async () => {
        let knex: Knex;
        let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
        const query = `query { typeCount }`;
        let response: request.Response;
        before(async () => {
            await createDBClient();
            const creationResult = await createApp({
                config,
                typeDefs: 'schema { query: Query } type Query { typeCount: Int }',
                customResolverBuilderMap: {
                    Query: {
                        typeCount: (knex: Knex) => async () =>
                            (await knex('Query').select('typeCount').where({ id: 1 }).first())
                                .typeCount * 3,
                    },
                },
            });
            app = creationResult.app;
            knex = creationResult.knex;
            await knex('Query').where({ id: 1 }).update({ typeCount: 3 });
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
        Then('atsakymo kūnas turėtų turėti typeCount padaugintą iš 3', async () => {
            response.body.should.deep.equal({
                data: { typeCount: 9 },
            });
        });
        And('duomenų bazėje turėtų būti išlikę seni duomenys', async () => {
            (await knex('Query').where({ typeCount: 3 })).length.should.be.ok;
        });
    });
    Scenario('Kliento išsprendėjas Mutation party', async () => {
        let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
        const query = `mutation { party }`;
        let response: request.Response;
        before(async () => {
            await createDBClient();
            const creationResult = await createApp({
                config,
                typeDefs: 'type Query { typeCount: Int } type Mutation { party: String }',
                customResolverBuilderMap: {
                    Mutation: {
                        party: () => () => '🎉',
                    },
                },
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
        Then('atsakymo kūnas turėtų turėti teisingą party', async () => {
            response.body.should.deep.equal({
                data: { party: '🎉' },
            });
        });
    });
});
