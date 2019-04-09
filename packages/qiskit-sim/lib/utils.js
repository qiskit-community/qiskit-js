/**
 * @license
 *
 * Copyright (c) 2017, IBM.
 *
 * This source code is licensed under the Apache License, Version 2.0 found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const utils = require('@qiskit/utils');
const math = require('mathjs');

const pkgName = require('../package.json').name;

utils.dbg = fullPath => utils.debug(`${pkgName}:${utils.pathToTag(fullPath)}`);

utils.randomString = length => {
  const len = length || 17;
  let text = '';
  // var first char to be letter
  let charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  text += charset.charAt(Math.floor(Math.random() * charset.length));
  // other chars can be numbers
  charset += '0123456789';

  for (let i = 0; i < len; i += 1) {
    text += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  return text;
};

utils.formatComplex = complex => {
  const re = math.round(complex.re, 8);
  const im = math.round(complex.im, 8);

  return `${re}${im >= 0 ? '+' : '-'}${math.abs(im)}i`;
};

module.exports = utils;
