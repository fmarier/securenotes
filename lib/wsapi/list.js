/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const
wsapi = require('../wsapi.js');

const
notes = require('../notes.js');

exports.url = '/list';
exports.method = 'get';
exports.writes_db = false;
//exports.authed = false; // TODO: set this to true

exports.process = function(req, res) {
    var user_id = 1; // TODO: use the logged in user
    var user_notes = notes.get_notes(
        user_id, function (user_notes) {
            res.render('list.ejs', {notes: user_notes});
        });
};
