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
const genHex = require('../lib/genHex');

const dbg = utils.dbg(__filename);

describe('devs:js:genHex', () => {
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
