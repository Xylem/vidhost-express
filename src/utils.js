'use strict';

function verifyAuthenticated(req, res, next) {
    if (req.user) {
        next();
        return;
    }

    res.redirect('/auth/google');
}

module.exports = {
    verifyAuthenticated
};
