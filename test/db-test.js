#!/usr/bin/env node

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const
assert = require('assert'),
users = require('../lib/users.js'),
notes = require('../lib/notes.js'),
vows = require('vows');

var suite = vows.describe("basic tests");
suite.options.error = false;

const TEST_EMAIL = 'person@example.com';

// TODO: test error conditions
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

// TODO: test error conditions
suite.addBatch(
    {
        "a new user": {
            topic: function () {
                var that = this;
                users.create_user(
                    TEST_EMAIL, function (email) {
                        users.get_account(
                            email, function (user_id) {
                                notes.get_notes(user_id, that.callback);
                            });
                    });
            },
            "has no notes": function (r) {
                assert.isArray(r);
                assert.strictEqual(r.length, 0);
            },
            "can create new notes": {
                topic: function () {
                    var that = this;
                    users.get_account(
                        TEST_EMAIL, function (user_id) {
                            notes.create_note(
                                "Note 1", "Content 1", user_id, function () {
                                    notes.get_notes(
                                        user_id, function (r) {
                                            var note_id = r[0].id;
                                            notes.view_note(
                                                note_id, user_id, function (note) {
                                                    that.callback(r, note);
                                                });
                                        });
                                });
                        });
                },
                "that exist": function (r) {
                    assert.isArray(r);
                    assert.strictEqual(r.length, 1);
                },
                "that look reasonable": function (r) {
                    var element = r[0];
                    assert.isObject(element);
                    assert.isNumber(element.id);
                    assert.ok(element.id > 0);
                    assert.strictEqual(element.deleted, 0);
                    assert.strictEqual(element.name, 'Note 1');
                },
                "that have the expected content": function (r, note) {
                    assert.isObject(note);
                    assert.strictEqual(note.content, 'Content 1');
                    assert.strictEqual(note.name, r[0].name);
                },
                "before deleting the user account": {
                    topic: function () {
                        users.delete_user(TEST_EMAIL, this.callback);
                    },
                    "successfully": function () {
                        assert.ok(true); // TODO: check for lack of errors
                    }
                }
            }
        }
    });

var data = [
    {name: 'Note 1', content: 'Content 1'},
    {name: 'Note 2', content: 'Content 2'},
    {name: 'Note 3', content: 'Content 3'},
    {name: 'Note 4', content: 'Content 4'}
];

// TODO: test error conditions
suite.addBatch(
    {
        "creating multiple notes": {
            topic: function () {
                var that = this;
                users.create_user(
                    TEST_EMAIL, function (email) {
                        users.get_account(
                            email, function (user_id) {
                                var count = 0;
                                data.forEach(
                                    function (v) {
                                        notes.create_note(
                                            v.name, v.content, user_id, function () {
                                                count += 1;
                                                if (count === data.length) {
                                                    notes.get_notes(user_id, that.callback);
                                                }
                                            });
                                    });
                            });
                    });
            },
            "returns the expected array": function (r) {
                assert.isArray(r);
                assert.strictEqual(r.length, data.length);
            },
            "gives non-deleted notes": function (r) {
                r.forEach(function (note) {
                              assert.strictEqual(note.deleted, 0);
                          });
            },
            "that can be deleted": {
                topic: function () {
                    var that = this;
                    users.get_account(
                        TEST_EMAIL, function (user_id) {
                            notes.get_notes(
                                user_id, function (r) {
                                    var count = 0;
                                    r.forEach(
                                        function (note) {
                                            notes.delete_note(
                                                note.id, user_id, function () {
                                                    count += 1;
                                                    if (count === data.length) {
                                                        notes.get_notes(user_id, that.callback);
                                                    }
                                                });
                                        });
                                });
                        });
                },
                "successfully": function (r) {
                    assert.isArray(r);
                    assert.strictEqual(r.length, data.length);
                    r.forEach(function (note) {
                                  assert.strictEqual(note.deleted, 1);
                              });
                },
                "and undeleted": {
                    topic: function () {
                        var that = this;
                        users.get_account(
                            TEST_EMAIL, function (user_id) {
                                notes.get_notes(
                                    user_id, function (r) {
                                        var count = 0;
                                        r.forEach(
                                            function (note) {
                                                notes.undelete_note(
                                                    note.id, user_id, function () {
                                                        count += 1;
                                                        if (count === data.length) {
                                                            notes.get_notes(user_id, that.callback);
                                                        }
                                                    });
                                            });
                                    });
                            });
                    },
                    "successfully": function (r) {
                        assert.isArray(r);
                        assert.strictEqual(r.length, data.length);
                        r.forEach(function (note) {
                                      assert.strictEqual(note.deleted, 0);
                                  });
                    },
                    "before deleting the user account": {
                        topic: function () {
                            users.delete_user(TEST_EMAIL, this.callback);
                        },
                        "successfully": function () {
                            assert.ok(true); // TODO: check for lack of errors
                        }
                    }
                }
            }
        }
    });

// run or export the suite.
if (process.argv[1] === __filename) suite.run();
else suite.export(module);
