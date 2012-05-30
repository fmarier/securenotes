/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const
conf = require('../configuration.js'),
users = require('../users.js'),
wsapi = require('../wsapi.js');

exports.url = '/loggedin';
exports.method = 'get';
exports.writes_db = false;
exports.authed = 'assertion';

exports.process = function(req, res) {
    users.get_key(
        req.session.userid, function (wrappedKey, identity) {
            res.render('loggedin.ejs',
                       {wrappedKey: wrappedKey, identity: identity,
                        includejs: conf.get('browserid').includejs});
        });
};
