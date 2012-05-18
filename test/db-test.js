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

// Setup / test account creation
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
                "which contains": {
                    topic: function () {
                        users.get_account(TEST_EMAIL, this.callback);
                    },
                    "a reasonable ID": function (r) {
                        assert.isNumber(r);
                        assert.strictEqual(r > 0, true);
                    }
                }
            }
        }
    }
);

var userId; // Will hold the ID of the test user account we created above

// TODO: test error conditions
suite.addBatch(
    {
        "a new user": {
            topic: function () {
                var cb = this.callback;
                users.get_account(
                    TEST_EMAIL, function (user_id) {
                        userId = user_id;
                        notes.get_notes(user_id, cb);
                    });
            },
            "has no notes": function (r) {
                assert.isArray(r);
                assert.isEmpty(r);
            },
            "can create a new note": {
                topic: function () {
                    var cb = this.callback;
                    notes.create_note(
                        "Note 1", "Content 1", userId, function () {
                            notes.get_notes(
                                userId, function (r) {
                                    var note_id = r[0].id;
                                    notes.view_note(
                                        note_id, userId, function (note) {
                                            cb(r, note);
                                        });
                                });
                        });
                },
                "that exists": function (r) {
                    assert.isArray(r);
                    assert.lengthOf(r, 1);
                },
                "that looks reasonable": function (r) {
                    var element = r[0];
                    assert.isObject(element);
                    assert.isNumber(element.id);
                    assert.ok(element.id > 0);
                    assert.strictEqual(element.deleted, 0);
                    assert.strictEqual(element.name, 'Note 1');
                },
                "that has the expected content": function (r, note) {
                    assert.isObject(note);
                    assert.strictEqual(note.content, 'Content 1');
                    assert.strictEqual(note.name, r[0].name);
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

var dbNotes; // Will hold the last note objects from the DB

// TODO: test error conditions
suite.addBatch(
    {
        "creating multiple notes": {
            topic: function () {
                var cb = this.callback;
                var count = 0;
                data.forEach(
                    function (v) {
                        notes.create_note(
                            v.name, v.content, userId, function () {
                                count += 1;
                                if (count === data.length) {
                                    notes.get_notes(
                                        userId, function (r) {
                                            dbNotes = r;
                                            cb(r);
                                        });
                                }
                            });
                    });
            },
            "returns the expected array": function (r) {
                assert.isArray(r);
                assert.lengthOf(r, data.length + 1);
            },
            "gives non-deleted notes": function (r) {
                r.forEach(function (note) {
                              assert.strictEqual(note.deleted, 0);
                          });
            },
            "that can be deleted": {
                topic: function () {
                    var cb = this.callback;
                    var count = 0;
                    dbNotes.forEach(
                        function (note) {
                            notes.delete_note(
                                note.id, userId, function () {
                                    count += 1;
                                    if (count === data.length) {
                                        notes.get_notes(
                                            userId, function (r) {
                                                dbNotes = r;
                                                cb(r);
                                            });
                                    }
                                });
                        });
                },
                "successfully": function (r) {
                    assert.isArray(r);
                    assert.lengthOf(r, data.length + 1);
                    r.forEach(function (note) {
                                  assert.strictEqual(note.deleted, 1);
                              });
                },
                "and undeleted": {
                    topic: function () {
                        var cb = this.callback;
                        var count = 0;
                        dbNotes.forEach(
                            function (note) {
                                notes.undelete_note(
                                    note.id, userId, function () {
                                        count += 1;
                                        if (count === data.length) {
                                            notes.get_notes(userId, cb);
                                        }
                                    });
                            });
                    },
                    "successfully": function (r) {
                        assert.isArray(r);
                        assert.lengthOf(r, data.length + 1);
                        r.forEach(function (note) {
                                      assert.strictEqual(note.deleted, 0);
                                  });
                    }
                }
            }
        }
    });

suite.addBatch(
    {
        "a new user": {
            topic: function () {
                users.get_key(userId, this.callback);
            },
            "has no key": function (wrapped_key) {
                assert.isNull(wrapped_key);
            },
            "can set a key": {
                topic: function () {
                    users.set_key(userId, 'wrapped key', this.callback);
                },
                "succesfully": function (r) {
                    assert.ok(true); // TODO: check for lack of errors
                },
                "which": {
                    topic: function () {
                        users.get_key(userId, this.callback);
                    },
                    "can be read": function (wrapped_key) {
                        assert.strictEqual(wrapped_key, 'wrapped key');
                    },
                    "cannot": {
                        topic: function () {
                            users.set_key(userId, 'another wrapped key', this.callback);
                        },
                        "be overwritten": function (r) {
                            assert.strictEqual(r, '{"success": true}');
                        },
                        "lose its value": {
                            topic: function () {
                                users.get_key(userId, this.callback);
                            },
                            "once it has been set": function (wrapped_key) {
                                assert.strictEqual(wrapped_key, 'wrapped key');
                            }
                        }
                    }
                }
            }
        }
    });

// Tear down / test account deletion
suite.addBatch(
    {
        "account deletion": {
            topic: function () {
                users.delete_user(TEST_EMAIL, this.callback);
            },
            "works": function () {
                assert.ok(true); // TODO: once we return errors, this won't have to be so pointless
            },
            "makes the account": {
                topic: function () {
                    users.account_exists(TEST_EMAIL, this.callback);
                },
                "disappear": function (r){
                    assert.ok(!r);
                }
            }
        }
    }
);

// run or export the suite.
if (process.argv[1] === __filename) suite.run();
else suite.export(module);
