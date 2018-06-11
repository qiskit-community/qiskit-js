/**
 * @license
 *
 * Copyright (c) 2017, IBM.
 *
 * This source code is licensed under the Apache License, Version 2.0 found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

// TODO: Repeated code in qiskit bin, qiskit-utils package needed?
const assert = require('assert');

/* eslint-disable import/no-extraneous-dependencies */
const shot = require('snap-shot-it');
const strip = require('strip-color');
/* eslint-enable import/no-extraneous-dependencies */

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
      assert.throws(() => {
        throw e;
      }, errorRexp);
    }
    // We need this return because we're catching the thrown error,
    // if not, the next assert.fail would be reached when the regexp matches.
    return;
  }

  assert.fail('Missing expected exception');
}

module.exports = { throwsAsync, shot, strip };
