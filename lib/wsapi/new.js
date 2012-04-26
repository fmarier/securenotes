/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const
wsapi = require('../wsapi.js');

exports.url = '/new';
exports.method = 'get';
exports.writes_db = false;
//exports.authed = false; // TODO: switch to true

exports.process = function(req, res) {
    res.render('new.ejs', {});
};
