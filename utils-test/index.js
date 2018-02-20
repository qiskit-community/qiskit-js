/*
  Copyright IBM Corp. 2017. All Rights Reserved.

  This code may only be used under the Apache 2.0 license found at
  http://www.apache.org/licenses/LICENSE-2.0.txt.

  Authors:
  - Jesús Pérez <jesusper@us.ibm.com>
*/

'use strict';


// TODO: Repeated code in qiskit bin, qiskit-utils package needed?
const assert = require('assert');

// eslint-disable-next-line import/no-extraneous-dependencies
const shot = require('snap-shot-it');


// A custom version of [assert.throws](https://nodejs.org/api/assert.html#
// assert_assert_throws_block_error_message) with async (through promises) support.
//
// - `block` (function) - Piece of code (returning a promise) to be checked.
// - `errRegex` (object) - Regular expresion to confirm the expected error.
//
// Ref: https://wietse.loves.engineering/testing-promises-with-mocha-90df8b7d2e35
async function throwsAsync(block, errorRexp) {
  try {
    await block();
  } catch (e) {
    // To be consistent with the Node.js "assert.throws" behavior we reuse it.
    if (errorRexp) {
      assert.throws(() => { throw e; }, errorRexp);
    }
    // We need this return because we're catching the thrown error,
    // if not, the next assert.fail would be reached when the regexp matches.
    return;
  }

  assert.fail('Missing expected exception');
}


module.exports = { throwsAsync, shot };
