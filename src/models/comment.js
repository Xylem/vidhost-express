'use strict';

const bookshelf = require('../dao/bookshelf');
const Video = require('./video');

const Comment = bookshelf.Model.extend({
    tableName: 'comments',
    video: function () {
        return this.belongsTo(Video);
    }
});

module.exports = Comment;
