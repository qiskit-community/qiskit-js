/**
 * @license
 *
 * Copyright (c) 2017, IBM.
 *
 * This source code is licensed under the Apache License, Version 2.0 found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const assert = require('assert');

const algo = require('..');
const { version } = require('../package');

// TODO: Use utils.difference instead.
function multiIncludes(text, values) {
  return values.every(val => text.includes(val));
}

describe('algo:api', () => {
  it('should include all documented items', () =>
    assert.ok(
      multiIncludes(Object.keys(algo), [
        'version',
        'random',
        'factor',
        'result',
      ]),
    ));
});

describe('algo:version', () =>
  it('should be correct', () => assert.equal(algo.version, version)));
