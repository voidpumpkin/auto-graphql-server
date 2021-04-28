import { expect } from 'chai';
import 'mocha-cakes-2';

import Knex from 'knex';

import { createApp } from '../src/createApp';
import { createDBClient } from './utils/createDBClient';
import { removeDBClient } from './utils/removeDBClient';
import config from './testConfig';

Feature('💽Duomenų bazės lentelių generavimas', async () => {
    Feature('Query lentelės generavimas su skaliariniais tipais', async () => {
        Scenario('Schemos query turi String skaliarinį tipą', async () => {
            let knex: Knex;
            after(async () => {
                await removeDBClient();
            });

            Given('kuriamas serveris', async () => {
                await createDBClient();
                const creationResult = await createApp({
                    config,
                    typeDefs: 'schema { query: Query } type Query { name: String }',
                });
                knex = creationResult.knex;
            });
            Then('turi būti sukurta Query lentelė', async () => {
                expect(await knex.schema.hasTable('Query')).to.be.true;
            });
            And('turi turėti id pirminio rakto stulpelį', async () => {
                expect(await knex.schema.hasColumn('Query', 'id')).to.be.true;
            });
            And('turi turėti name stulpelį', async () => {
                expect(await knex.schema.hasColumn('Query', 'name')).to.be.true;
            });
            And('jo tipas turi atitkti schemoje nurodytą tipą', async () => {
                expect((await knex('Query').columnInfo('name')).type).to.be.oneOf([
                    'varchar',
                    'character varying',
                ]);
            });
        });
        Scenario('Schemos query turi 2 skaliarinius tipus', async () => {
            let knex: Knex;
            after(async () => {
                await removeDBClient();
            });

            Given('kuriamas serveris', async () => {
                await createDBClient();
                const creationResult = await createApp({
                    config,
                    typeDefs: 'schema { query: Query } type Query { name: String iteration: Int }',
                });
                knex = creationResult.knex;
            });
            Then('turi būti sukurta Query lentelė', async () => {
                expect(await knex.schema.hasTable('Query')).to.be.true;
            });
            And('turi turėti id pirminio rakto stulpelį', async () => {
                expect(await knex.schema.hasColumn('Query', 'id')).to.be.true;
            });
            And('turi turėti skaliarų stulpelius', async () => {
                expect(await knex.schema.hasColumn('Query', 'name')).to.be.true;
                expect(await knex.schema.hasColumn('Query', 'iteration')).to.be.true;
            });
            And('jų tipai turi atitkti schemoje nurodytus tipus', async () => {
                expect((await knex('Query').columnInfo('name')).type).to.be.oneOf([
                    'varchar',
                    'character varying',
                ]);
                expect((await knex('Query').columnInfo('iteration')).type).to.be.oneOf([
                    'integer',
                    'int',
                ]);
            });
        });
    });
    Feature('Objiektų tipo esybių lentelių generavimas', async () => {
        Scenario('Schemos query turi 1 objiekto tipą', async () => {
            let knex: Knex;
            after(async () => {
                await removeDBClient();
            });

            Given('kuriamas serveris', async () => {
                await createDBClient();
                const creationResult = await createApp({
                    config,
                    typeDefs:
                        'schema { query: Query } type Query { book: Book } type Book { name: String iteration: Int }',
                });
                knex = creationResult.knex;
            });
            Then('turi būti sukurtos objiektų lentelės', async () => {
                expect(await knex.schema.hasTable('Query')).to.be.true;
                expect(await knex.schema.hasTable('Book')).to.be.true;
            });
            And('jie turi turėti po id pirminio rakto stulpelį', async () => {
                expect(await knex.schema.hasColumn('Query', 'id')).to.be.true;
                expect(await knex.schema.hasColumn('Book', 'id')).to.be.true;
            });
            And('jų tipai turi būti teisingi', async () => {
                expect((await knex('Query').columnInfo('id')).type).to.be.oneOf(['integer', 'int']);
                expect((await knex('Book').columnInfo('id')).type).to.be.oneOf(['integer', 'int']);
            });
            And('tipų su skaliarais lentelės turi turėti skaliarų stulpelius', async () => {
                expect(await knex.schema.hasColumn('Book', 'name')).to.be.true;
                expect(await knex.schema.hasColumn('Book', 'iteration')).to.be.true;
            });
            And('jų tipai turi atitkti schemoje nurodytus tipus', async () => {
                expect((await knex('Book').columnInfo('name')).type).to.be.oneOf([
                    'varchar',
                    'character varying',
                ]);
                expect((await knex('Book').columnInfo('iteration')).type).to.be.oneOf([
                    'integer',
                    'int',
                ]);
            });
            And('tipų su objiektais lentelės turi turėti svetimus raktų stulpelius', async () => {
                expect(await knex.schema.hasColumn('Query', 'book')).to.be.true;
            });
            And('jų tipai turi būti teisingi', async () => {
                expect((await knex('Query').columnInfo('book')).type).to.be.oneOf([
                    'integer',
                    'int',
                ]);
            });
        });
        Scenario(
            'Schemos query turi objiekto tipą kuris turi kitą objiekto tipą ir tipą kuris turi dar savo objiekto tipą',
            async () => {
                let knex: Knex;
                after(async () => {
                    await removeDBClient();
                });

                Given('kuriamas serveris', async () => {
                    await createDBClient();
                    const creationResult = await createApp({
                        config,
                        typeDefs:
                            'schema { query: Query } type Query { book: Book } type Book { author: Author } type Author { name: String }',
                    });
                    knex = creationResult.knex;
                });
                Then('turi būti sukurtos objiektų lentelės', async () => {
                    expect(await knex.schema.hasTable('Query')).to.be.true;
                    expect(await knex.schema.hasTable('Book')).to.be.true;
                    expect(await knex.schema.hasTable('Author')).to.be.true;
                });
                And('jie turi turėti po id pirminio rakto stulpelį', async () => {
                    expect(await knex.schema.hasColumn('Query', 'id')).to.be.true;
                    expect(await knex.schema.hasColumn('Book', 'id')).to.be.true;
                    expect(await knex.schema.hasColumn('Author', 'id')).to.be.true;
                });
                And('jų tipai turi būti teisingi', async () => {
                    expect((await knex('Query').columnInfo('id')).type).to.be.oneOf([
                        'integer',
                        'int',
                    ]);
                    expect((await knex('Book').columnInfo('id')).type).to.be.oneOf([
                        'integer',
                        'int',
                    ]);
                    expect((await knex('Author').columnInfo('id')).type).to.be.oneOf([
                        'integer',
                        'int',
                    ]);
                });
                And('tipų su skaliarais lentelės turi turėti skaliarų stulpelius', async () => {
                    expect(await knex.schema.hasColumn('Author', 'name')).to.be.true;
                });
                And('jų tipai turi atitkti schemoje nurodytus tipus', async () => {
                    expect((await knex('Author').columnInfo('name')).type).to.be.oneOf([
                        'varchar',
                        'character varying',
                    ]);
                });
                And(
                    'tipų su objiektais lentelės turi turėti svetimus raktų stulpelius',
                    async () => {
                        expect(await knex.schema.hasColumn('Query', 'book')).to.be.true;
                        expect(await knex.schema.hasColumn('Book', 'author')).to.be.true;
                    }
                );
                And('jų tipai turi būti teisingi', async () => {
                    expect((await knex('Query').columnInfo('book')).type).to.be.oneOf([
                        'integer',
                        'int',
                    ]);
                    expect((await knex('Book').columnInfo('author')).type).to.be.oneOf([
                        'integer',
                        'int',
                    ]);
                });
            }
        );
    });
    Feature('Skaliarinių sarašų tipo esybių lentelių generavimas', async () => {
        Scenario('Schemos query turi skaliarinį sąrašą', async () => {
            let knex: Knex;
            after(async () => {
                await removeDBClient();
            });

            Given('kuriamas serveris', async () => {
                await createDBClient();
                const creationResult = await createApp({
                    config,
                    typeDefs: 'schema { query: Query } type Query { probabilities: [Float] }',
                });
                knex = creationResult.knex;
            });
            Then('turi būti sukurtos objiektų lentelės', async () => {
                expect(await knex.schema.hasTable('Query')).to.be.true;
            });
            And('jie turi turėti po id pirminio rakto stulpelį', async () => {
                expect(await knex.schema.hasColumn('Query', 'id')).to.be.true;
            });
            And('jų tipai turi būti teisingi', async () => {
                expect((await knex('Query').columnInfo('id')).type).to.be.oneOf(['integer', 'int']);
            });
            And('turi būti sukurtos skaliarinių sarašų lentelės', async () => {
                expect(await knex.schema.hasTable('__Query_probabilities_list')).to.be.true;
            });
            And(
                'tos lentelės turi turėti pirminio rakto, reikšmės ir svetimo rakto stulpelius',
                async () => {
                    expect(await knex.schema.hasColumn('__Query_probabilities_list', 'id')).to.be
                        .true;
                    expect(await knex.schema.hasColumn('__Query_probabilities_list', 'value')).to.be
                        .true;
                    expect(await knex.schema.hasColumn('__Query_probabilities_list', 'Query_id')).to
                        .be.true;
                }
            );
            And('jų tipai turi būti teisingi', async () => {
                expect((await knex('__Query_probabilities_list').columnInfo('id')).type).to.include(
                    'int'
                );
                expect(
                    (await knex('__Query_probabilities_list').columnInfo('value')).type
                ).to.be.oneOf(['float', 'real']);
                expect(
                    (await knex('__Query_probabilities_list').columnInfo('Query_id')).type
                ).to.be.oneOf(['integer', 'int']);
            });
        });
        Scenario('Schemos query turi 2 skaliarinius sąrašus', async () => {
            let knex: Knex;
            after(async () => {
                await removeDBClient();
            });

            Given('kuriamas serveris', async () => {
                await createDBClient();
                const creationResult = await createApp({
                    config,
                    typeDefs:
                        'schema { query: Query } type Query { probabilities: [Float] executionResults: [Boolean] }',
                });
                knex = creationResult.knex;
            });
            Then('turi būti sukurtos objiektų lentelės', async () => {
                expect(await knex.schema.hasTable('Query')).to.be.true;
            });
            And('jie turi turėti po id pirminio rakto stulpelį', async () => {
                expect(await knex.schema.hasColumn('Query', 'id')).to.be.true;
            });
            And('jų tipai turi būti teisingi', async () => {
                expect((await knex('Query').columnInfo('id')).type).to.be.oneOf(['integer', 'int']);
            });
            And('turi būti sukurtos skaliarinių sarašų lentelės', async () => {
                expect(await knex.schema.hasTable('__Query_probabilities_list')).to.be.true;
                expect(await knex.schema.hasTable('__Query_executionResults_list')).to.be.true;
            });
            And(
                'tos lentelės turi turėti pirminio rakto, reikšmės ir svetimo rakto stulpelius',
                async () => {
                    expect(await knex.schema.hasColumn('__Query_probabilities_list', 'id')).to.be
                        .true;
                    expect(await knex.schema.hasColumn('__Query_probabilities_list', 'value')).to.be
                        .true;
                    expect(await knex.schema.hasColumn('__Query_probabilities_list', 'Query_id')).to
                        .be.true;
                    expect(await knex.schema.hasColumn('__Query_executionResults_list', 'id')).to.be
                        .true;
                    expect(await knex.schema.hasColumn('__Query_executionResults_list', 'value')).to
                        .be.true;
                    expect(await knex.schema.hasColumn('__Query_executionResults_list', 'Query_id'))
                        .to.be.true;
                }
            );
            And('jų tipai turi būti teisingi', async () => {
                expect((await knex('__Query_probabilities_list').columnInfo('id')).type).to.include(
                    'int'
                );
                expect(
                    (await knex('__Query_probabilities_list').columnInfo('value')).type
                ).to.be.oneOf(['float', 'real']);
                expect(
                    (await knex('__Query_probabilities_list').columnInfo('Query_id')).type
                ).to.be.oneOf(['integer', 'int']);
                expect(
                    (await knex('__Query_executionResults_list').columnInfo('id')).type
                ).to.be.oneOf(['integer', 'int']);
                expect(
                    (await knex('__Query_executionResults_list').columnInfo('value')).type
                ).to.be.oneOf(['boolean', 'tinyint']);
                expect(
                    (await knex('__Query_executionResults_list').columnInfo('Query_id')).type
                ).to.be.oneOf(['integer', 'int']);
            });
        });
    });
    Feature('Objiektų sarašų tipo esybių lentelių generavimas', async () => {
        Scenario('Schemos query turi objiekto tipo sąrašą', async () => {
            let knex: Knex;
            after(async () => {
                await removeDBClient();
            });

            Given('kuriamas serveris', async () => {
                await createDBClient();
                const creationResult = await createApp({
                    config,
                    typeDefs:
                        'schema { query: Query } type Query { books: [Book] } type Book { name: String }',
                });
                knex = creationResult.knex;
            });
            Then('turi būti sukurtos objiektų lentelės', async () => {
                expect(await knex.schema.hasTable('Query')).to.be.true;
                expect(await knex.schema.hasTable('Book')).to.be.true;
            });
            And('jos turi turėti po id pirminio rakto stulpelį', async () => {
                expect(await knex.schema.hasColumn('Query', 'id')).to.be.true;
                expect(await knex.schema.hasColumn('Book', 'id')).to.be.true;
            });
            And('jų tipai turi būti teisingi', async () => {
                expect((await knex('Query').columnInfo('id')).type).to.be.oneOf(['integer', 'int']);
                expect((await knex('Book').columnInfo('id')).type).to.be.oneOf(['integer', 'int']);
            });
            And('tipų su skaliarais lentelės turi turėti skaliarų stulpelius', async () => {
                expect(await knex.schema.hasColumn('Book', 'name')).to.be.true;
            });
            And('jų tipai turi atitkti schemoje nurodytus tipus', async () => {
                expect((await knex('Book').columnInfo('name')).type).to.be.oneOf([
                    'varchar',
                    'character varying',
                ]);
            });
            And('objiektų sąrašo tipo esybės turi tureti savo lenteles', async () => {
                expect(await knex.schema.hasTable('__Query_books_list')).to.be.true;
            });
            And('jie turi turėti tesingus stulpelius', async () => {
                expect(await knex.schema.hasColumn('__Query_books_list', 'id')).to.be.true;
                expect(await knex.schema.hasColumn('__Query_books_list', 'Query_id')).to.be.true;
                expect(await knex.schema.hasColumn('__Query_books_list', 'Query_books_Book_id')).to
                    .be.true;
            });
            And('jų tipai turi būti teisingi', async () => {
                expect((await knex('__Query_books_list').columnInfo('id')).type).to.be.oneOf([
                    'integer',
                    'int',
                ]);
                expect((await knex('__Query_books_list').columnInfo('Query_id')).type).to.be.oneOf([
                    'integer',
                    'int',
                ]);
                expect(
                    (await knex('__Query_books_list').columnInfo('Query_books_Book_id')).type
                ).to.be.oneOf(['integer', 'int']);
            });
        });
        Scenario(
            'Schemos query turi objiekto tipo sąrašą kuris turi objiekto tipo sąrašą',
            async () => {
                let knex: Knex;
                after(async () => {
                    await removeDBClient();
                });

                Given('kuriamas serveris', async () => {
                    await createDBClient();
                    const creationResult = await createApp({
                        config,
                        typeDefs:
                            'schema { query: Query } type Query { books: [Book] } type Book { author: [Author] } type Author { name: String }',
                    });
                    knex = creationResult.knex;
                });
                Then('turi būti sukurtos objiektų lentelės', async () => {
                    expect(await knex.schema.hasTable('Query')).to.be.true;
                    expect(await knex.schema.hasTable('Book')).to.be.true;
                    expect(await knex.schema.hasTable('Author')).to.be.true;
                });
                And('jos turi turėti po id pirminio rakto stulpelį', async () => {
                    expect(await knex.schema.hasColumn('Query', 'id')).to.be.true;
                    expect(await knex.schema.hasColumn('Book', 'id')).to.be.true;
                    expect(await knex.schema.hasColumn('Author', 'id')).to.be.true;
                });
                And('jų tipai turi būti teisingi', async () => {
                    expect((await knex('Query').columnInfo('id')).type).to.be.oneOf([
                        'integer',
                        'int',
                    ]);
                    expect((await knex('Book').columnInfo('id')).type).to.be.oneOf([
                        'integer',
                        'int',
                    ]);
                    expect((await knex('Author').columnInfo('id')).type).to.be.oneOf([
                        'integer',
                        'int',
                    ]);
                });
                And('tipų su skaliarais lentelės turi turėti skaliarų stulpelius', async () => {
                    expect(await knex.schema.hasColumn('Author', 'name')).to.be.true;
                });
                And('jų tipai turi atitkti schemoje nurodytus tipus', async () => {
                    expect((await knex('Author').columnInfo('name')).type).to.be.oneOf([
                        'varchar',
                        'character varying',
                    ]);
                });
                And('objiektų sąrašo tipo esybės turi tureti savo lenteles', async () => {
                    expect(await knex.schema.hasTable('__Query_books_list')).to.be.true;
                    expect(await knex.schema.hasTable('__Book_author_list')).to.be.true;
                });
                And('jie turi turėti tesingus stulpelius', async () => {
                    expect(await knex.schema.hasColumn('__Query_books_list', 'id')).to.be.true;
                    expect(await knex.schema.hasColumn('__Query_books_list', 'Query_id')).to.be
                        .true;
                    expect(await knex.schema.hasColumn('__Query_books_list', 'Query_books_Book_id'))
                        .to.be.true;
                    expect(await knex.schema.hasColumn('__Book_author_list', 'id')).to.be.true;
                    expect(await knex.schema.hasColumn('__Book_author_list', 'Book_id')).to.be.true;
                    expect(
                        await knex.schema.hasColumn('__Book_author_list', 'Book_author_Author_id')
                    ).to.be.true;
                });
                And('jų tipai turi būti teisingi', async () => {
                    expect((await knex('__Query_books_list').columnInfo('id')).type).to.be.oneOf([
                        'integer',
                        'int',
                    ]);
                    expect(
                        (await knex('__Query_books_list').columnInfo('Query_id')).type
                    ).to.be.oneOf(['integer', 'int']);
                    expect(
                        (await knex('__Query_books_list').columnInfo('Query_books_Book_id')).type
                    ).to.be.oneOf(['integer', 'int']);
                    expect((await knex('__Book_author_list').columnInfo('id')).type).to.be.oneOf([
                        'integer',
                        'int',
                    ]);
                    expect(
                        (await knex('__Book_author_list').columnInfo('Book_id')).type
                    ).to.be.oneOf(['integer', 'int']);
                    expect(
                        (await knex('__Book_author_list').columnInfo('Book_author_Author_id')).type
                    ).to.be.oneOf(['integer', 'int']);
                });
            }
        );
    });
    //TODO: Not implemented
    Feature.skip("Lentelių generavimas su interface'ais", async () => {
        Scenario("Interface'sas turi 1 skaliarinio tipo esybę", async () => {
            let knex: Knex;
            after(async () => {
                await removeDBClient();
            });

            Given('kuriamas serveris', async () => {
                await createDBClient();
                const creationResult = await createApp({
                    config,
                    typeDefs:
                        'schema { query: Query } type Query implements Face { name: String } interface Face { score: Int }',
                });
                knex = creationResult.knex;
            });
            Then('turi būti sukurtos objiektų lentelės', async () => {
                expect(await knex.schema.hasTable('Query')).to.be.true;
            });
            And('jie turi turėti po id pirminio rakto stulpelį', async () => {
                expect(await knex.schema.hasColumn('Query', 'id')).to.be.true;
            });
            And('jų tipai turi būti teisingi', async () => {
                expect((await knex('Query').columnInfo('id')).type).to.be.oneOf(['integer', 'int']);
            });
            And('tipų su skaliarais lentelės turi turėti skaliarų stulpelius', async () => {
                expect(await knex.schema.hasColumn('Query', 'name')).to.be.true;
            });
            And('jų tipai turi atitkti schemoje nurodytus tipus', async () => {
                expect((await knex('Query').columnInfo('name')).type).to.be.oneOf([
                    'varchar',
                    'character varying',
                ]);
            });
            And(
                'paveldėjusių tipų lentelės turi turėti paveldėtus skaliarinius stulpelius',
                async () => {
                    expect(await knex.schema.hasColumn('Query', 'score')).to.be.true;
                }
            );
            And('jų tipai turi atitkti schemoje nurodytus tipus', async () => {
                expect((await knex('Query').columnInfo('score')).type).to.be.oneOf([
                    'integer',
                    'int',
                ]);
            });
        });
        Scenario("Interface'sas turi skaliarinio tipo sąrašą", async () => {
            let knex: Knex;
            after(async () => {
                await removeDBClient();
            });

            Given('kuriamas serveris', async () => {
                await createDBClient();
                const creationResult = await createApp({
                    config,
                    typeDefs:
                        'schema { query: Query } type Query implements Face { name: String } interface Face { scores: [Int] }',
                });
                knex = creationResult.knex;
            });
            Then('turi būti sukurtos objiektų lentelės', async () => {
                expect(await knex.schema.hasTable('Query')).to.be.true;
            });
            And('jie turi turėti po id pirminio rakto stulpelį', async () => {
                expect(await knex.schema.hasColumn('Query', 'id')).to.be.true;
            });
            And('jų tipai turi būti teisingi', async () => {
                expect((await knex('Query').columnInfo('id')).type).to.be.oneOf(['integer', 'int']);
            });
            And('tipų su skaliarais lentelės turi turėti skaliarų stulpelius', async () => {
                expect(await knex.schema.hasColumn('Query', 'name')).to.be.true;
            });
            And('jų tipai turi atitkti schemoje nurodytus tipus', async () => {
                expect((await knex('Query').columnInfo('name')).type).to.be.oneOf([
                    'varchar',
                    'character varying',
                ]);
            });
            And('turi būti sukurtos paveldėtų skaliarinių sarašų lentelės', async () => {
                expect(await knex.schema.hasTable('__Query_scores_list')).to.be.true;
            });
            And(
                'tos lentelės turi turėti pirminio rakto, reikšmės ir svetimo rakto stulpelius',
                async () => {
                    expect(await knex.schema.hasColumn('__Query_scores_list', 'id')).to.be.true;
                    expect(await knex.schema.hasColumn('__Query_scores_list', 'value')).to.be.true;
                    expect(await knex.schema.hasColumn('__Query_scores_list', 'Query_scores_id')).to
                        .be.true;
                }
            );
            And('jų tipai turi būti teisingi', async () => {
                expect((await knex('__Query_scores_list').columnInfo('id')).type).to.be.string(
                    'integer'
                );
                expect((await knex('__Query_scores_list').columnInfo('value')).type).to.be.string(
                    'integer'
                );
                expect(
                    (await knex('__Query_scores_list').columnInfo('Query_scores_id')).type
                ).to.be.oneOf(['integer', 'int']);
            });
        });
        Scenario("Interface'sas turi objiekto tipo sąrašą", async () => {
            let knex: Knex;
            after(async () => {
                await removeDBClient();
            });

            Given('kuriamas serveris', async () => {
                const creationResult = await createApp({
                    config,
                    typeDefs:
                        'schema { query: Query } type Query implements Face { name: String } interface Face { books: [Book] } type Book { name: String }',
                });
                knex = creationResult.knex;
            });
            Then('turi būti sukurtos objiektų lentelės', async () => {
                expect(await knex.schema.hasTable('Query')).to.be.true;
                expect(await knex.schema.hasTable('Book')).to.be.true;
            });
            And('jie turi turėti po id pirminio rakto stulpelį', async () => {
                expect(await knex.schema.hasColumn('Query', 'id')).to.be.true;
                expect(await knex.schema.hasColumn('Book', 'id')).to.be.true;
            });
            And('jų tipai turi būti teisingi', async () => {
                expect((await knex('Query').columnInfo('id')).type).to.be.oneOf(['integer', 'int']);
                expect((await knex('Book').columnInfo('id')).type).to.be.oneOf(['integer', 'int']);
            });
            And('tipų su skaliarais lentelės turi turėti skaliarų stulpelius', async () => {
                expect(await knex.schema.hasColumn('Query', 'name')).to.be.true;
                expect(await knex.schema.hasColumn('Book', 'name')).to.be.true;
            });
            And('jų tipai turi atitkti schemoje nurodytus tipus', async () => {
                expect((await knex('Query').columnInfo('name')).type).to.be.oneOf([
                    'varchar',
                    'character varying',
                ]);
                expect((await knex('Book').columnInfo('name')).type).to.be.oneOf([
                    'varchar',
                    'character varying',
                ]);
            });
            And(
                'tipų kurie yra tevų objiekte kaip sąrašas lentelės turi turėti svetimus tėvų raktų stulpelius',
                async () => {
                    expect(await knex.schema.hasColumn('Book', 'Query_books_id')).to.be.true;
                }
            );
            And('jų tipai turi būti teisingi', async () => {
                expect((await knex('Book').columnInfo('Query_books_id')).type).to.be.string(
                    'integer'
                );
            });
        });
        Scenario("Objiektas paveldi 2 Interface'sus", async () => {
            let knex: Knex;
            after(async () => {
                await removeDBClient();
            });

            Given('kuriamas serveris', async () => {
                await createDBClient();
                const creationResult = await createApp({
                    config,
                    typeDefs:
                        'schema { query: Query } type Query implements Face & Body { name: String } interface Face { score: Int } interface Body { hasLimbs: Boolean }',
                });
                knex = creationResult.knex;
            });
            Then('turi būti sukurtos objiektų lentelės', async () => {
                expect(await knex.schema.hasTable('Query')).to.be.true;
            });
            And('jie turi turėti po id pirminio rakto stulpelį', async () => {
                expect(await knex.schema.hasColumn('Query', 'id')).to.be.true;
            });
            And('jų tipai turi būti teisingi', async () => {
                expect((await knex('Query').columnInfo('id')).type).to.be.oneOf(['integer', 'int']);
            });
            And('tipų su skaliarais lentelės turi turėti skaliarų stulpelius', async () => {
                expect(await knex.schema.hasColumn('Query', 'name')).to.be.true;
                expect(await knex.schema.hasColumn('Query', 'score')).to.be.true;
                expect(await knex.schema.hasColumn('Query', 'hasLimbs')).to.be.true;
            });
            And('jų tipai turi atitkti schemoje nurodytus tipus', async () => {
                expect((await knex('Query').columnInfo('name')).type).to.be.oneOf([
                    'varchar',
                    'character varying',
                ]);
                expect((await knex('Query').columnInfo('score')).type).to.be.oneOf([
                    'integer',
                    'int',
                ]);
                expect((await knex('Query').columnInfo('hasLimbs')).type).to.be.oneOf([
                    'boolean',
                    'tinyint',
                ]);
            });
        });
        Scenario("Objiektas paveldi Interface'a kuris paveldi kitą Interface'a", async () => {
            let knex: Knex;
            after(async () => {
                await removeDBClient();
            });

            Given('kuriamas serveris', async () => {
                await createDBClient();
                const creationResult = await createApp({
                    config,
                    typeDefs:
                        'schema { query: Query } type Query implements Face { name: String } interface Face implements Circle { score: Int } interface Circle { hasLimbs: Boolean }',
                });
                knex = creationResult.knex;
            });
            Then('turi būti sukurtos objiektų lentelės', async () => {
                expect(await knex.schema.hasTable('Query')).to.be.true;
            });
            And('jie turi turėti po id pirminio rakto stulpelį', async () => {
                expect(await knex.schema.hasColumn('Query', 'id')).to.be.true;
            });
            And('jų tipai turi būti teisingi', async () => {
                expect((await knex('Query').columnInfo('id')).type).to.be.oneOf(['integer', 'int']);
            });
            And('tipų su skaliarais lentelės turi turėti skaliarų stulpelius', async () => {
                expect(await knex.schema.hasColumn('Query', 'name')).to.be.true;
                expect(await knex.schema.hasColumn('Query', 'score')).to.be.true;
                expect(await knex.schema.hasColumn('Query', 'hasLimbs')).to.be.true;
            });
            And('jų tipai turi atitkti schemoje nurodytus tipus', async () => {
                expect((await knex('Query').columnInfo('name')).type).to.be.oneOf([
                    'varchar',
                    'character varying',
                ]);
                expect((await knex('Query').columnInfo('score')).type).to.be.oneOf([
                    'integer',
                    'int',
                ]);
                expect((await knex('Query').columnInfo('hasLimbs')).type).to.be.oneOf([
                    'boolean',
                    'tinyint',
                ]);
            });
        });
    });
});
