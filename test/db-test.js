#!/usr/bin/env node

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const
assert = require('assert'),
users = require('../lib/users.js'),
vows = require('vows');

var suite = vows.describe("basic tests");
suite.options.error = false;

const TEST_EMAIL = 'person@example.com';

suite.addBatch(
    {
        "account creation": {
            topic: function () {
                users.create_user(TEST_EMAIL, this.callback);
            },
            "works": function (r) {
                assert.strictEqual(r, TEST_EMAIL);
            },
            "produces an account": {
                topic: function () {
                    users.account_exists(TEST_EMAIL, this.callback);
                },
                "which exists": function (r){
                    assert.ok(r);
                },
                "which": {
                    topic: function () {
                        users.get_account(TEST_EMAIL, this.callback);
                    },
                    "contains a reasonable ID": function (r) {
                        assert.isNumber(r);
                        assert.strictEqual(r > 0, true);
                    },
                    "can be deleted": {
                        topic: function () {
                            users.delete_user(TEST_EMAIL, this.callback);
                        },
                        "without errors": function () {
                            assert.ok(true); // TODO: once we return errors, this won't have to be so pointless
                        },
                        "and when looking for it": {
                            topic: function () {
                                users.account_exists(TEST_EMAIL, this.callback);
                            },
                            "it is gone": function (r){
                                assert.ok(!r);
                            }
                        }
                    }
                }
            }
        }
    });

// run or export the suite.
if (process.argv[1] === __filename) suite.run();
else suite.export(module);
