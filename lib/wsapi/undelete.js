/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const
wsapi = require('../wsapi.js');

const
notes = require('../notes.js');

exports.url = '/undelete';
exports.method = 'post';
exports.writes_db = true;
//exports.authed = false; // TODO: switch to true

exports.process = function(req, res) {
    var user_id = 1; // TODO: get from session
    notes.undelete_note(
        req.body.id, user_id, function () {
            res.redirect('list'); // TODO: fix this
        });
};
