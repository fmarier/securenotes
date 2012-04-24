#!/usr/bin/env node

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const
assert = require('assert'),
vows = require('vows');

var suite = vows.describe("basic tests");
suite.options.error = false;

suite.addBatch({
  "do absolutely nothing": {
    topic: function() {
        this.callback();
    },
      "and nothing happens as expected": function() {
        assert.ok(true);
    }
  }
});

// run or export the suite.
if (process.argv[1] === __filename) suite.run();
else suite.export(module);
