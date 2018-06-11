/**
 * @license
 *
 * Copyright (c) 2017, IBM.
 *
 * This source code is licensed under the Apache License, Version 2.0 found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

// We can't use "utils.*" here to avoid a circular dep.
const debug = require('debug');
const lodash = require('lodash');
const ayb = require('all-your-base');

const { name } = require('../package');

const formats = ['hex'];
const dbg = debug(name);

// TODO: Document this.
module.exports = async (genHex, opts = {}) => {
  let len = 16;

  dbg('Passed opts:', opts);

  if (!genHex) {
    throw new Error('Required "genHex" param');
  }

  if (opts.length) {
    if (typeof opts.length !== 'number') {
      throw new TypeError('A number expected for "length"');
    }

    len = opts.length;
  }
  dbg('Parsed opts:', { len });

  const hexadecimal = await genHex(len);

  dbg('Generated number (hexadecimal):', {
    hexadecimal,
    len: hexadecimal.length,
  });

  if (opts.format) {
    if (!lodash.includes(formats, opts.format)) {
      throw new Error(`Not supported "format", allowed: ${formats}`);
    }

    // We make this check here to return in advance and avoit to
    // convert it to decimal in this cases.
    if (opts.format === 'hex') {
      return hexadecimal;
    }
  }

  // ie (after "ayb"): 1.1914622019661597e+24, 5.591825073748114e+23
  const decimal = ayb.parseInt(hexadecimal, 16, 10);

  dbg('Generated number (decimal):', { decimal });

  // To return a value between 0 and 1 (similar to "Math.floor").
  return decimal / 10 ** decimal.toString().length;
};
