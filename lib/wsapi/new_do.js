/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const
wsapi = require('../wsapi.js');

const
conf = require('../configuration.js'),
notes = require('../notes.js');

exports.url = '/new';
exports.method = 'post';
exports.writes_db = true;
exports.authed = 'assertion';

exports.process = function(req, res) {
    notes.create_note(
        req.body.name, req.body.content, req.session.userid, function () {
            res.redirect(conf.get('public_url') + '/list');
        });
};
