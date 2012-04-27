/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const
https = require('https'),
qs = require('qs'),
wsapi = require('../wsapi.js');

const
users = require('../users.js');

const AUDIENCE = "http://localhost:8000";

exports.url = '/login';
exports.method = 'post';
exports.writes_db = true;
exports.authed = false;

exports.process = function(req, res) {
    function loginUser(email) {
        if (!req.session) {
            req.session = {};
        }
        users.get_account(
            email, function (user_id) {
                wsapi.authenticateSession(req.session, user_id, 'assertion');
                res.redirect('/list');
            });
    }

    function onVerifyResp(bidRes) {
        var data = "";
        bidRes.setEncoding('utf8');
        bidRes.on(
            'data', function (chunk) {
                data += chunk;
            });
        bidRes.on('end', function () {
            var verified = JSON.parse(data);
            if (verified.status == 'okay') {
                users.account_exists( // TODO: roll this into loginUser and remove need for account_exists()
                    verified.email, function (exists) {
                        if (exists) {
                            loginUser(verified.email);
                        } else {
                            users.create_user(
                                verified.email, function (email) {
                                    loginUser(email);
                                });
                        }
                    });
            } else {
                console.error("BrowserID verification error: " + verified.reason);
            }
        });
    };

    var assertion = req.body.assertion;

    var body = qs.stringify({
        assertion: assertion,
        audience: AUDIENCE
    });
    var request = https.request(
        {
            host: 'browserid.org',
            path: '/verify',
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'content-length': body.length
            }
        }, onVerifyResp);
    request.write(body);
    request.end();
};
