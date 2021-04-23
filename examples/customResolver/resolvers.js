module.exports = {
    Query: {
        books: function (knex) {
            return async function (root, args, context, info) {
                return await knex('Book').select().where(args);
            };
        },
    },
    Mutation: {
        party: () => () => '🥳🥳🥳',
    },
};
