'use strict';

const knex = require('knex')({
    client: 'pg',
    connection: {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        charset: 'utf8'
    }
});

const bookshelf = require('bookshelf')(knex);

bookshelf.plugin('visibility');
bookshelf.plugin('pagination');

module.exports = bookshelf;
