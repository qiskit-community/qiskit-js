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
const path = require('path');

// Lodash as base.
const utils = require('lodash');
const debug = require('debug');
const promisify = require('es6-promisify');
const validator = require('validator');

const { version } = require('./package.json');


function pathToTag(fullPath) {
  const res = path.basename(fullPath, '.js');

  if (!res || res === fullPath) {
    throw new Error('Not valid path');
  } else {
    return res;
  }
}


// The easiest way to play with promises in Mocha:
// https://wietse.loves.engineering/testing-promises-with-mocha-90df8b7d2e35
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


// Exposed stuff.
utils.version = version;
utils.pathToTag = pathToTag;
utils.debug = debug;
utils.promisify = promisify;
utils.validator = validator;
utils.throwsAsync = throwsAsync;


module.exports = utils;
