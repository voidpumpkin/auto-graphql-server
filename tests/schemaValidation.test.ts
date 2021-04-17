import { expect } from 'chai';
import 'mocha-cakes-2';

import { getResolverlessSchema } from '../src/schema/getResolverlessSchema';

Feature('🛑Schemos validacija', async () => {
    Feature('Schemos šakninio query tipo esybių pavadinimų validacijos', async () => {
        Scenario('Nevalidus pavadinimas book', async () => {
            let wrapedFunction: () => void;
            When('validuojama schema', async () => {
                wrapedFunction = () =>
                    getResolverlessSchema({
                        typeDefs: `schema { book: Book } type Book { name: String }`,
                    });
            });
            Then(
                'turi išmesti validavimo klaidą, nes book pavadinimas nėra leidžiamas šakninei esybei ',
                async () => {
                    expect(wrapedFunction).to.throw();
                }
            );
        });
        Scenario('Nevalidus pavadinimas mutation', async () => {
            let wrapedFunction: () => void;
            When('validuojama schema', async () => {
                wrapedFunction = () =>
                    getResolverlessSchema({
                        typeDefs: `schema { mutation: Book } type Book { name: String }`,
                    });
            });
            Then(
                'turi mesti validavimo klaidą, nes mutation pavadinimas yra automatiškai sugeneruojamas',
                async () => {
                    expect(wrapedFunction).to.throw();
                }
            );
        });
        Scenario('Validus pavadinimas subscription', async () => {
            let wrapedFunction: () => void;
            When('validuojama schema', async () => {
                wrapedFunction = () =>
                    getResolverlessSchema({
                        typeDefs: `schema { subscription: Book } type Book { name: String }`,
                    });
            });
            Then(
                'turi nemesti validavimo klaidos, nes subscription pavadinimas yra leidžiamas šakninei esybei ',
                async () => {
                    expect(wrapedFunction).to.not.throw();
                }
            );
        });
        Scenario('Validus pavadinimas query', async () => {
            let wrapedFunction: () => void;
            When('validuojama schema', async () => {
                wrapedFunction = () =>
                    getResolverlessSchema({
                        typeDefs: `schema { query: Book } type Book { name: String }`,
                    });
            });
            Then(
                'turi nemesti validavimo klaidos, nes query pavadinimas yra leidžiamas šakninei esybei ',
                async () => {
                    expect(wrapedFunction).to.not.throw();
                }
            );
        });
    });
    Feature('Schemos query tipo validavimas', async () => {
        Scenario('Nevalidus tipas ID', async () => {
            let wrapedFunction: () => void;
            When('validuojama schema', async () => {
                wrapedFunction = () =>
                    getResolverlessSchema({
                        typeDefs: `schema { query: ID }`,
                    });
            });
            Then(
                'turi išmesti validavimo klaidą, nes tik objiekto tipas yra leidžiamas query esybei ',
                async () => {
                    expect(wrapedFunction).to.throw();
                }
            );
        });
        Scenario('Nevalidus tipas String', async () => {
            let wrapedFunction: () => void;
            When('validuojama schema', async () => {
                wrapedFunction = () =>
                    getResolverlessSchema({
                        typeDefs: `schema { query: String }`,
                    });
            });
            Then(
                'turi išmesti validavimo klaidą, nes tik objiekto tipas yra leidžiamas query esybei ',
                async () => {
                    expect(wrapedFunction).to.throw();
                }
            );
        });
        Scenario('Nevalidus tipas Int', async () => {
            let wrapedFunction: () => void;
            When('validuojama schema', async () => {
                wrapedFunction = () =>
                    getResolverlessSchema({
                        typeDefs: `schema { query: Int }`,
                    });
            });
            Then(
                'turi išmesti validavimo klaidą, nes tik objiekto tipas yra leidžiamas query esybei ',
                async () => {
                    expect(wrapedFunction).to.throw();
                }
            );
        });
        Scenario('Nevalidus tipas Float', async () => {
            let wrapedFunction: () => void;
            When('validuojama schema', async () => {
                wrapedFunction = () =>
                    getResolverlessSchema({
                        typeDefs: `schema { query: Float }`,
                    });
            });
            Then(
                'turi išmesti validavimo klaidą, nes tik objiekto tipas yra leidžiamas query esybei ',
                async () => {
                    expect(wrapedFunction).to.throw();
                }
            );
        });
        Scenario('Nevalidus tipas Boolean', async () => {
            let wrapedFunction: () => void;
            When('validuojama schema', async () => {
                wrapedFunction = () =>
                    getResolverlessSchema({
                        typeDefs: `schema { query: Boolean }`,
                    });
            });
            Then(
                'turi išmesti validavimo klaidą, nes tik objiekto tipas yra leidžiamas query esybei ',
                async () => {
                    expect(wrapedFunction).to.throw();
                }
            );
        });
        Scenario('Nevalidus tipas skaliarų sąrašas', async () => {
            let wrapedFunction: () => void;
            When('validuojama schema', async () => {
                wrapedFunction = () =>
                    getResolverlessSchema({
                        typeDefs: `schema { query: [Boolean] }`,
                    });
            });
            Then(
                'turi išmesti validavimo klaidą, nes tik objiekto tipas yra leidžiamas query esybei ',
                async () => {
                    expect(wrapedFunction).to.throw();
                }
            );
        });
        Scenario('Nevalidus tipas objiektų sąrašas', async () => {
            let wrapedFunction: () => void;
            When('validuojama schema', async () => {
                wrapedFunction = () =>
                    getResolverlessSchema({
                        typeDefs: `schema { query: [Book] } type Book { id: ID }`,
                    });
            });
            Then(
                'turi išmesti validavimo klaidą, nes tik objiekto tipas yra leidžiamas query esybei ',
                async () => {
                    expect(wrapedFunction).to.throw();
                }
            );
        });
    });
    Scenario('Schema turi tipą Mutation', async () => {
        let wrapedFunction: () => void;
        When('validuojama schema', async () => {
            wrapedFunction = () =>
                getResolverlessSchema({
                    typeDefs: `schema { query: Book } type Book { mut: Mutation } type Mutation { book: Book }`,
                });
        });
        Then(
            'turi mesti validavimo klaidą, nes Mutation tipas yra automatiškia generuojamas',
            async () => {
                expect(wrapedFunction).to.throw();
            }
        );
    });
});
