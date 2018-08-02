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

const utils = require('@qiskit/utils');

const qiskit = require('..');
const { name, version } = require('../package');
const genHex = require('../lib/genHex');

const dbg = utils.debug(`${name}:test`);

describe('devs:anu:api', () => {
  it('should include all documented items', () => {
    assert.equal(
      utils.difference(['version', 'random'], Object.keys(qiskit)),
      0,
    );
  });
});

describe('devs:anu:version', () => {
  it('should be included', () => assert.equal(qiskit.version, version));
});

describe('devs:anu:random', () => {
  it('should return a number between 0 and 1 without options', async () => {
    this.retries(4);

    const res = await qiskit.random();
    dbg('Result', res);

    assert.ok(res >= 0);
    assert.ok(res <= 1);
  });
});

describe('devs:anu:genHex', () => {
  it('should return a hex string of the default length without options', async () => {
    this.retries(4);

    const res = await genHex();
    dbg('Result', res);

    assert.ok(typeof res === 'string');
    assert.ok(res.length === 16);
  });

  it('devs:anu:should return a hex string of the desired length if passed', async () => {
    this.retries(4);

    const len = 8;
    const res = await genHex(len);
    dbg('Result', res);

    assert.ok(typeof res === 'string');
    assert.ok(res.length === len);
  });
});
