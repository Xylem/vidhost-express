'use strict';

const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const Busboy = require('busboy');
const express = require('express');
const passport = require('passport');
const range = require('express-range');
const uuid = require('uuid/v4');
const verifyAuthenticated = require('../utils').verifyAuthenticated;

const router = express.Router();

const Video = require('../models/video');

router.get('/', function (req, res) {
    Video.fetchPage({
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

router.post('/', verifyAuthenticated, function (req, res) {
    const busboy = new Busboy({
        headers: req.headers
    });

    const ALLOWED_FIELDS = [ 'title', 'description' ];
    const video = {
        path: path.resolve(process.env.STORAGE_ROOT, uuid()),
        author: req.user.id
    };

    busboy.on('file', function (fieldname, file) {
        if (fieldname === 'video') {
            file.pipe(fs.createWriteStream(video.path));
        }
    });

    busboy.on('field', function (fieldname, value) {
        if (_.includes(ALLOWED_FIELDS, fieldname)) {
            video[fieldname] = value;
        }
    });

    busboy.on('finish', function () {
        fs.stat(video.path, function (err, stats){
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            }

            video.size = stats.size;

            Video.forge(video).save().asCallback(function (err, data) {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                    return;
                }

                res.sendStatus(201);
            });
        });
    });

    req.pipe(busboy);
});

router.get('/:id', function (req, res) {
    Video.where('id', req.params.id).fetch().asCallback(function (err, data) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }

        if (!data) {
            res.sendStatus(404);
            return;
        }

        res.send(data.toJSON());
    });
});

function getVideoByID(req, res, getVideoByIDDone) {
    Video.where('id', req.params.id).fetch().asCallback(function (err, video) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }

        if (!video) {
            res.sendStatus(404);
            return;
        }

        getVideoByIDDone(video);
    });
}

const MAX_CHUNK_SIZE = 5242880; // 5MB

router.get('/:id/stream', range({
    accept: 'bytes',
    limit: MAX_CHUNK_SIZE
}), function (req, res) {
    getVideoByID(req, res, function (video) {
        const readOptions = {};

        if (req.range) {
            const videoSize = parseInt(video.get('size'), 10);
            const firstByte = parseInt(req.range.first, 10) || 0;
            const lastByte = Math.min(parseInt(req.range.last, 10), videoSize - 1) ||
                Math.min(firstByte + MAX_CHUNK_SIZE - 1, videoSize - 1);

            res.range({
                first: firstByte,
                last: lastByte,
                length: videoSize
            });

            readOptions.start = firstByte;
            readOptions.end = lastByte;
        }

        fs.createReadStream(video.get('path'), readOptions).pipe(res);
    });
});

router.delete('/:id', verifyAuthenticated, function (req, res) {
    getVideoByID(req, res, function (video) {
        if (video.get('author') !== req.user.id) {
            res.sendStatus(403);
            return;
        }

        fs.unlink(video.get('path'), function (err) {
            if (err) {
                console.error(`Failed to unlink path ${video.path}`);
            }
        });

        video.destroy().asCallback(function (err) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            }

            res.sendStatus(200);
        });
    });
});

router.get('/:id/comments', function (req, res) {
    getVideoByID(req, res, function (video) {
        // using array as an argument for fetchPage is a workaround for https://github.com/tgriesser/bookshelf/pull/1469
        video.related('comments').fetchPage([{
            page: req.query.page,
            pageSize: req.query.limit
        }]).asCallback(function (err, data) {
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
});

router.post('/:id/comments', verifyAuthenticated, function (req, res) {
    if (!req.body && req.body.content) {
        req.sendStatus(400);
        return;
    }

    getVideoByID(req, res, function (video) {
        video.related('comments').create({
            content: req.body.content,
            author: req.user.id
        }).asCallback(function (err) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            }

            res.sendStatus(201);
        });
    });
});

module.exports = router;
