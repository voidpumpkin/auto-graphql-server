import request from 'supertest';
import { assert } from 'chai';

import main from '../index';

describe('main()', async () => {
    it('should run simple graphql request', async () => {
        try {
            const response = await request((await main(false)).listen())
                .post(`/`)
                .set('Accept', 'application/json')
                .send({ query: '{book{name}}' });
            assert.deepEqual(response.body, { data: { book: { name: 'bob' } } });
            assert.strictEqual(response.status, 200);
        } catch (err) {
            throw err;
        }
    });
});
