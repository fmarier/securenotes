/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const
conf = require('./configuration.js'),
mysql = require('mysql');

var client = mysql.createClient({
  user: conf.get('database').user,
  password: conf.get('database').password
});
client.query('USE ' + conf.get('database').name);

exports.get_notes = function (user_id, cb) {
    client.query(
        "SELECT id, name, deleted FROM note WHERE owner = ? ORDER BY name", [user_id],
        function (err, results, fields) {
            if (err) {
                throw err;
            }
            cb(results);
        });
};

exports.view_note = function (note_id, user_id, cb) {
    client.query(
        "SELECT name, content FROM note WHERE id = ? AND owner = ? AND deleted = 0", [note_id, user_id],
        function (err, results, fields) {
            if (err) {
                throw err;
            }
            cb(results[0]);
        });
};

exports.create_note = function (name, content, owner, cb) {
    if (!name || !content) {
        cb(); // TODO: return an error
        return;
    }

    client.query(
        "INSERT INTO note(name, content, owner, ctime) VALUES (?, ?, ?, ?)",
        [name, content, owner, Date.now()], function (err, results, field) {
            if (err) {
                throw err;
            }
            cb();
        });
};

exports.delete_note = function (note_id, user_id, cb) {
    client.query(
        "UPDATE note SET deleted = 1 WHERE id = ? AND owner = ?", [note_id, user_id],
        function (err, results, fields) {
            if (err) {
                throw err;
            }
            cb();
        });
};

exports.undelete_note = function (note_id, user_id, cb) {
    client.query(
        "UPDATE note SET deleted = 0 WHERE id = ? AND owner = ?", [note_id, user_id],
        function (err, results, fields) {
            if (err) {
                throw err;
            }
            cb();
        });
};
