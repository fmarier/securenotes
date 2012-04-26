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
//exports.authed = false;

exports.process = function(req, res) {
    function loginUser(email) {
        console.log("email = " + email);
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
                console.info('browserid auth successful, setting req.session.email');
                users.account_exists(
                    verified.email, function (exists) {
                        if (exists) {
                            loginUser(verified.email);
                        } else {
                            console.log("user is not in the database");
                            users.create_user(verified.email, loginUser);
                        }
                    });
            } else {
                console.error(verified.reason);
            }
            res.json(verified);
        });
    };

    var assertion = req.body.assertion;

    var body = qs.stringify({
        assertion: assertion,
        audience: AUDIENCE
    });
    console.info('verifying with browserid');
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
