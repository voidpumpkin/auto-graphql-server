import { expect } from 'chai';

import { getSourceSchema } from '../src/schema/getSourceSchema';

describe('Feature: Schema validation', async () => {
    describe('Given schema has Book type', async () => {
        describe('And is named book', async () => {
            describe('When source schema is parsed', async () => {
                it('Expect error as only fields named mutation, query or subscription', async () => {
                    expect(() =>
                        getSourceSchema({
                            typeDefs: `schema { book: Book } type Book { name: String }`,
                        })
                    ).to.throw();
                });
            });
        });
        describe('And is named mutation', async () => {
            describe('When source schema is parsed', async () => {
                it('Expect no error as fields named mutation is allowed', async () => {
                    expect(() =>
                        getSourceSchema({
                            typeDefs: `schema { mutation: Book } type Book { name: String }`,
                        })
                    ).to.not.throw();
                });
            });
        });
        describe('And is named subscription', async () => {
            describe('When source schema is parsed', async () => {
                it('Expect no error as fields named subscription is allowed', async () => {
                    expect(() =>
                        getSourceSchema({
                            typeDefs: `schema { subscription: Book } type Book { name: String }`,
                        })
                    ).to.not.throw();
                });
            });
        });
        describe('And is named query', async () => {
            describe('When source schema is parsed', async () => {
                it('Expect no error as fields named query is allowed', async () => {
                    expect(() =>
                        getSourceSchema({
                            typeDefs: `schema { query: Book } type Book { name: String }`,
                        })
                    ).to.not.throw();
                });
            });
        });
    });
    describe('Given schema has field query', async () => {
        describe('And query type is ID', async () => {
            describe('When source schema is parsed', async () => {
                it('Expect error as schema fields can only be Objects', async () => {
                    expect(() =>
                        getSourceSchema({
                            typeDefs: `schema { query: ID }`,
                        })
                    ).to.throw();
                });
            });
        });
        describe('And query type is String', async () => {
            describe('When source schema is parsed', async () => {
                it('Expect error as schema fields can only be Objects', async () => {
                    expect(() =>
                        getSourceSchema({
                            typeDefs: `schema { query: String }`,
                        })
                    ).to.throw();
                });
            });
        });
        describe('And query type is Int', async () => {
            describe('When source schema is parsed', async () => {
                it('Expect error as schema fields can only be Objects', async () => {
                    expect(() =>
                        getSourceSchema({
                            typeDefs: `schema { query: Int }`,
                        })
                    ).to.throw();
                });
            });
        });
        describe('And query type is Float', async () => {
            describe('When source schema is parsed', async () => {
                it('Expect error as schema fields can only be Objects', async () => {
                    expect(() =>
                        getSourceSchema({
                            typeDefs: `schema { query: Float }`,
                        })
                    ).to.throw();
                });
            });
        });
        describe('And query type is Boolean', async () => {
            describe('When source schema is parsed', async () => {
                it('Expect error as schema fields can only be Objects', async () => {
                    expect(() =>
                        getSourceSchema({
                            typeDefs: `schema { query: Boolean }`,
                        })
                    ).to.throw();
                });
            });
        });
        describe('And query type is Book list', async () => {
            describe('When source schema is parsed', async () => {
                it('Expect error as schema fields can only be Objects', async () => {
                    expect(() =>
                        getSourceSchema({
                            typeDefs: `schema { query: [Book] } type Book { id: ID }`,
                        })
                    ).to.throw();
                });
            });
        });
    });
});
