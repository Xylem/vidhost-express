'use strict';

const bookshelf = require('../dao/bookshelf');
const Comment = require('./comment');

const Video = bookshelf.Model.extend({
    tableName: 'videos',
    hidden: [ 'path', 'size' ],
    comments: function () {
        return this.hasMany(Comment);
    }
});

module.exports = Video;
