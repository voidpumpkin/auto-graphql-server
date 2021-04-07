import request from 'supertest';
import { assert } from 'chai';

import { createApp } from '../src/createApp';
import { getSourceSchema } from '../src/getSourceSchema';

import config from './testConfig.json';

describe.skip('Http Responses', async () => {
    it('should run simple graphql request', async () => {
        const sourceSchema = getSourceSchema({
            typeDefs: `schema { query: Query } type Query { book: book } type book { name: String }`,
        });
        const response = await request((await createApp({ config, sourceSchema })).listen())
            .post(`/`)
            .set('Accept', 'application/json')
            .send({ query: '{book{name}}' });
        assert.deepEqual(response.body, { data: { book: { name: 'bob' } } });
        assert.strictEqual(response.status, 200);
    });
});
