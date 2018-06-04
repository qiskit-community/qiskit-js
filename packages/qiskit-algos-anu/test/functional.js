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

const utils = require('@qiskit/utils');

const algos = require('..');
const { name, version } = require('../package');
const genHex = require('../lib/genHex');

const dbg = utils.debug(`${name}:test`);

describe('api', () => {
  it('should include all documented items', () => {
    assert.equal(
      utils.difference(['version', 'random'], Object.keys(algos)),
      0,
    );
  });
});

describe('version', () => {
  it('should be included', () => assert.equal(algos.version, version));
});

describe('random', () => {
  it('should return a number between 0 and 1 without options', async () => {
    const res = await algos.random();
    dbg('Result', res);

    assert.ok(res >= 0);
    assert.ok(res <= 1);
  });
});

describe('genHex', () => {
  it('should return a hex string of the default length without options', async () => {
    const res = await genHex();
    dbg('Result', res);

    assert.ok(typeof res === 'string');
    assert.ok(res.length === 16);
  });

  it('should return a hex string of the desired length if passed', async () => {
    const len = 8;
    const res = await genHex(len);
    dbg('Result', res);

    assert.ok(typeof res === 'string');
    assert.ok(res.length === len);
  });
});
