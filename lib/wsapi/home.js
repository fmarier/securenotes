/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const
conf = require('../configuration.js'),
wsapi = require('../wsapi.js');

exports.url = '/';
exports.method = 'get';
exports.writes_db = false;
exports.authed = false;

exports.process = function(req, res) {
    if (req.session.userid) {
        res.redirect(conf.get('public_url') + '/list');
    } else {
        res.redirect(conf.get('public_url') + '/login');
    }
};
