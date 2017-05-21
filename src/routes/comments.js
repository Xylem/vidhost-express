'use strict';

const passport = require('passport');
const express = require('express');
const router = express.Router();
const verifyAuthenticated = require('../utils').verifyAuthenticated;

const Comment = require('../models/comment');

router.delete('/:id', verifyAuthenticated, function (req, res) {
    Comment.where('id', req.params.id).fetch().asCallback(function (err, comment) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }

        if (!comment) {
            res.sendStatus(404);
            return;
        }

        if (comment.get('author') !== req.user.id) {
            res.sendStatus(403);
            return;
        }

        comment.destroy().asCallback(function (err) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            }

            res.sendStatus(200);
        });
    });
});

module.exports = router;
