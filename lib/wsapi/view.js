/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const
wsapi = require('../wsapi.js');

const
notes = require('../notes.js');

exports.url = '/view';
exports.method = 'get';
exports.writes_db = false;
//exports.authed = false; // TODO: switch to true

exports.process = function(req, res) {
    var user_id = 1; // TODO: get from session
    var note_id = req.query.note;
    if (note_id) {
        notes.view_note(
            note_id, user_id, function (note) {
                if (note) {
                    res.render('view.ejs', {note: note});
                } else {
                    res.write('Invalid note ID');
                    res.end();
                }
            });
    } else {
        res.write('Missing note ID');
        res.end();
    }
};
