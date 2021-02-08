import Koa from 'koa';
import Knex, { CreateTableBuilder } from 'knex';
import { diff } from 'rus-diff';

type BuilderMethod = keyof CreateTableBuilder;
type Table = Record<string, BuilderMethod[]>;
type Schema = Record<string, Table>;

const OLD_SCHEMA: Schema = {
    users: {
        id: ['increments'],
        firstname: ['string'],
        lastname: ['string'],
        age: ['integer'],
    },
};
const NEW_SCHEMA: Schema = {
    users: {
        id: ['increments'],
        firstname: ['string'],
        lastname: ['string'],
        middlename: ['string'],
        age: ['integer'],
    },
};
console.log('Proof of concept for schema diff', diff(OLD_SCHEMA, NEW_SCHEMA));

const app = new Koa();
const knex = Knex({
    client: 'sqlite3',
    connection: {
        filename: './test.sqlite3',
    },
    useNullAsDefault: true,
});

(async () => {
    if (!(await knex.schema.hasTable('users'))) {
        await knex.schema.createTable('users', (tableBuilder) => {
            tableBuilder.increments();
            tableBuilder.string('firstname');
            tableBuilder.string('lastname');
            tableBuilder.integer('age');
        });
        await knex('users').insert([
            { firstname: 'bob', lastname: 'rogers', age: 25 },
            { firstname: 'sammy', lastname: 'rogers', age: 23 },
            { firstname: 'al', lastname: 'rogers', age: 40 },
            { firstname: 'smit', lastname: 'chocolate', age: 60 },
        ]);
    }
})();

app.use(async (ctx) => {
    const users = await knex.select().table('users');
    ctx.body = { users };
});

const PORT = 3000;
console.log(`Listening at http://localhost:${PORT}`);
app.listen(PORT);
