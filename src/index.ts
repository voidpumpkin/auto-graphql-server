import Koa from 'koa';
import Knex from 'knex';

const app = new Koa();
const knex = Knex({
    client: 'sqlite3',
    connection: {
        filename: './test.sqlite3',
    },
    useNullAsDefault: true,
});

(async () => {
    const copyTable = async (from: string, to: string): Promise<void> => {
        const ids = await knex(from).select('id');
        await Promise.all(
            ids.map(async ({ id }) => {
                const entry = await knex(from).select().where('id', id);
                await knex(to).insert(entry);
            })
        );
    };

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
    } else {
        await knex.schema.createTable('TEMP_NAME_ID_users', (tableBuilder) => {
            tableBuilder.increments();
            tableBuilder.string('firstname');
            tableBuilder.string('lastname');
            tableBuilder.integer('age');
        });
        await copyTable('users', 'TEMP_NAME_ID_users');
        await knex.schema.dropTable('users');
        await knex.schema.createTable('users', (tableBuilder) => {
            tableBuilder.increments();
            tableBuilder.string('firstname');
            tableBuilder.string('lastname');
            tableBuilder.string('middlename');
            tableBuilder.integer('age');
        });
        await copyTable('TEMP_NAME_ID_users', 'users');
        await knex.schema.dropTable('TEMP_NAME_ID_users');
    }
})();

app.use(async (ctx) => {
    const users = await knex.select().table('users');
    ctx.body = { users };
});

const PORT = 3000;
console.log(`Listening at http://localhost:${PORT}`);
app.listen(PORT);
