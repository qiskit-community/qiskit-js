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

const utils = require('../lib/utils');

const qiskit = require('..');
const { version } = require('../package');

const dbg = utils.dbg(__filename);

describe('algo:js:api', () => {
  it('should include all documented items', () => {
    assert.equal(
      utils.difference(['version', 'random', 'factor'], Object.keys(qiskit)),
      0,
    );
  });
});

describe('algo:js:version', () => {
  it('should be included', () => assert.equal(qiskit.version, version));
});

describe('algo:js:random', () => {
  it('should return a number between 0 and 1 without options', async () => {
    const res = await qiskit.random();
    dbg('Result', res);

    assert.ok(res >= 0);
    assert.ok(res <= 1);
  });
});

describe('algo:js:factor', () => {
  it('should work for a small integer', async () => {
    const res = await qiskit.factor(15);
    dbg('Result', res);

    assert(res === 3 || res === 5);
  });
});
