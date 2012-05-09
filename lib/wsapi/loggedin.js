/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const
https = require('https'),
qs = require('qs'),
wsapi = require('../wsapi.js');

const
users = require('../users.js');

exports.url = '/loggedin';
exports.method = 'get';
exports.writes_db = false;
exports.authed = 'assertion';

exports.process = function(req, res) {
    res.render('loggedin.ejs', {
                   assertion: req.session.assertion,
                   wrappedKey: req.session.wrappedKey
               });
};
