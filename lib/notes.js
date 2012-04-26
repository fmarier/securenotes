/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const
mysql = require('mysql');

const DB_USER = 'nodeuser';
const DB_PASSWORD = 'nodeuser';
const DB_NAME = 'securenotes';

var client = mysql.createClient({
  user: DB_USER,
  password: DB_PASSWORD
});
client.query('USE ' + DB_NAME);

exports.get_notes = function (user_id, cb) {
    client.query(
        "SELECT id, name FROM note WHERE owner = ? ORDER BY name", [user_id],
        function (err, results, fields) {
            if (err) {
                throw err;
            }
            cb(results);
        });
};

exports.view_note = function (note_id, user_id, cb) {
    client.query(
        "SELECT name, content FROM note WHERE id = ? AND owner = ?", [note_id, user_id],
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
