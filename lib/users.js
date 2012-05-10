/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const
mysql = require('mysql');

const
conf = require('./configuration.js');

var client = mysql.createClient({
  user: conf.get('database').user,
  password: conf.get('database').password
});
client.query('USE ' + conf.get('database').name);

exports.account_exists = function (email, cb) {
    if (!email) {
        cb(); // TODO: return an error
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

exports.get_account = function (email, cb) {
    if (!email) {
        cb(); // TODO: return an error
        return;
    }

    client.query(
        "SELECT id, wrappedkey FROM account WHERE email = ?", [email],
        function (err, results, fields) {
            if (err) {
                throw err;
            }
            cb(results[0].id);
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

exports.get_key = function (userId, cb) {
    client.query(
        "SELECT wrappedkey FROM account WHERE id = ?", [userId],
        function (err, results, fields) {
            if (err) {
                throw err;
            }
            cb(results[0].wrappedkey);
        });
};

exports.set_key = function (userId, wrappedKey, cb) {
    if (!wrappedKey) {
        cb('{"success": true}');
    }

    // Set the wrapped key if it's not already set
    client.query(
        "UPDATE account SET wrappedkey = ? WHERE id = ? AND wrappedkey IS NULL",
        [wrappedKey, userId], function (err, results, field) {
            if (err) {
                throw err;
            }
            cb('{"success": true}');
        });
};

exports.delete_user = function (email, cb) {
    if (!email.match(emailRegexp)) {
        cb(); // TODO: return an error
        return;
    }

    client.query(
        "DELETE note FROM note JOIN account ON account.id = note.owner WHERE account.email = ?", [email],
        function (err, results, field) {
            if (err) {
                throw err;
            }
            client.query(
                "DELETE FROM account WHERE email = ?", [email],
                function (err, results, field) {
                    if (err) {
                        throw err;
                    }
                    cb();
                });
        });
};
