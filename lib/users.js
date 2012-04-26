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

exports.account_exists = function (email, cb) {
    if (!email) {
        cb(); // TODO: return some error
        return;
    }

    client.query(
        "SELECT id FROM account WHERE email = ?", [email],
        function (err, results, fields) {
            if (err) {
                throw err;
            }
            cb(results[0] && true);
        });
};

var emailRegexp = new RegExp(/^.+@[A-Za-z0-9.\-]+$/);

exports.create_user = function (email, cb) {
    if (!email.match(emailRegexp)) {
        cb(); // TODO: return an error
        return;
    }

    client.query(
        "INSERT INTO account(email) VALUES (?)", [email],
        function (err, results, field) {
            if (err) {
                throw err;
            }
            cb(email);
        });
};
