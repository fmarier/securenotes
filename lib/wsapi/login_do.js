/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const
http = require('http'),
https = require('https'),
qs = require('qs'),
wsapi = require('../wsapi.js');

const
conf = require('../configuration.js'),
users = require('../users.js');

const AUDIENCE = conf.get('public_url');

exports.url = '/login';
exports.method = 'post';
exports.writes_db = true;
exports.authed = false;

exports.process = function(req, res) {
    var assertion = req.body.assertion;

    function loginUser(email) {
        if (!req.session) {
            req.session = {};
        }
        users.get_account(
            email, function (userId) {
                wsapi.authenticateSession(req.session, userId, 'assertion');
                res.redirect(conf.get('public_url') + '/loggedin');
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
            if (verified.status === 'okay') {
                users.account_exists(
                    verified.email, function (exists) {
                        if (exists) {
                            loginUser(verified.email);
                        } else {
                            users.create_user(
                                verified.email, function (email) {
                                    if (email) {
                                        loginUser(email);
                                    } else {
                                        res.send("User creation failed.");
                                    }
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
    var scheme = (conf.get('browserid').verifier.scheme === 'http') ? http : https;
    var request = scheme.request(
        {
            host: conf.get('browserid').verifier.host,
            port: conf.get('browserid').verifier.port,
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
