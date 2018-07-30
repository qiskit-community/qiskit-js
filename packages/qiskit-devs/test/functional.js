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

const devs = require('..');
const { version } = require('../package');

// TODO: Use utils.difference instead.
function multiIncludes(text, values) {
  return values.every(val => text.includes(val));
}

describe('devs:api', () => {
  it('should include all documented items', () => {
    assert.ok(multiIncludes(Object.keys(devs), ['random', 'result', 'factor']));
  });
});

describe('devs:version', () =>
  it('should be correct', () => assert.equal(devs.version, version)));
