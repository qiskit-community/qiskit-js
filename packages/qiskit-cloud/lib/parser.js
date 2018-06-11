/**
 * @license
 *
 * Copyright (c) 2017, IBM.
 *
 * This source code is licensed under the Apache License, Version 2.0 found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

module.exports.number = (num, min, max) => {
  if (!num || typeof num !== 'number') {
    throw new Error(`Number format expected, found: ${num}`);
  }

  if (((min || min === 0) && num < min) || (max && num > max)) {
    throw new Error(`Out of range, found: ${num}`);
  }

  return num;
};

module.exports.string = str => {
  if (!str || typeof str !== 'string') {
    throw new Error(`String format expected, found: ${str}`);
  }

  return str;
};

module.exports.bool = value => {
  if (!value || typeof value !== 'boolean') {
    throw new Error(`Boolean format expected, found: ${value}`);
  }

  return value;
};
