'use strict';

const passport = require('passport');
const express = require('express');
const router = express.Router();

const Comment = require('../models/comment');
const Video = require('../models/video');

router.get('/:id/comments', function (req, res) {
    Comment.where('author', req.params.id).fetchPage({
        page: req.query.page,
        pageSize: req.query.limit
    }).asCallback(function (err, data) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }

        res.send({
            comments: data.toJSON(),
            pagination: data.pagination
        });
    });
});

router.get('/:id/videos', function (req, res) {
    Video.where('author', req.params.id).fetchPage({
        page: req.query.page,
        pageSize: req.query.limit
    }).asCallback(function (err, data) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }

        res.send({
            videos: data.toJSON(),
            pagination: data.pagination
        });
    });
});

module.exports = router;
