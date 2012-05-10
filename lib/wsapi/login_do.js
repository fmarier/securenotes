/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const
https = require('https'),
qs = require('qs'),
conf = require('../configuration.js'),
wsapi = require('../wsapi.js');

const
users = require('../users.js');

const AUDIENCE = "http://" + conf.get('bind_to').host + ":" + conf.get('bind_to').port;

exports.url = '/login';
exports.method = 'post';
exports.writes_db = true;
exports.authed = false;

exports.process = function(req, res) {
    var assertion = req.body.assertion;

    function loginUser(email, assertion) {
        if (!req.session) {
            req.session = {};
        }
        users.get_account(
            email, function (userId) {
                wsapi.authenticateSession(req.session, userId, 'assertion');
                req.session.assertion = assertion;
                res.redirect('/loggedin');
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
                            loginUser(verified.email, assertion);
                        } else {
                            users.create_user(
                                verified.email, function (email) {
                                    loginUser(email, assertion);
                                });
                        }
                    });
            } else {
                res.send("BrowserID verification error: " + verified.reason);
            }
        });
    };

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
