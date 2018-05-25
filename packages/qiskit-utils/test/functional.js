/**
 * @license
 *
 * Copyright (c) 2017-present, IBM Research.
 *
 * This source code is licensed under the Apache license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const assert = require('assert');

const utils = require('..');
const { version } = require('../package');

function multiIncludes(text, values) {
  return values.every(val => text.includes(val));
}

describe('utils:api', () => {
  it('should include all documented items', () => {
    assert.ok(
      multiIncludes(Object.keys(utils), ['version', 'debug', 'pathToTag']),
    );
  });

  it('should return the the correct result for its methods', () =>
    assert.equal(utils.version, version));
});

describe('sim:utils:pathToTag', () => {
  // We can use this function here to get the name of this file
  // because we're testing it.
  it('should work with a valid file name', () =>
    assert.equal('index', utils.pathToTag('./a/b/c/index.js')));

  it('should fail with an invalid file name', () =>
    assert.throws(() => {
      utils.pathToTag('a');
    }, /Not valid path/));
});
