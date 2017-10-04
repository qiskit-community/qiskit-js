/*
  Copyright IBM Corp. 2017. All Rights Reserved.

  This code may only be used under the Apache 2.0 license found at
  http://www.apache.org/licenses/LICENSE-2.0.txt.

  Authors:
  - Jesús Pérez <jesusper@us.ibm.com>
*/

'use strict';


module.exports.number = (num, min, max) => {
  if (!num || typeof num !== 'number') {
    throw new Error(`Number format expected: ${num}`);
  }

  if (((min || min === 0) && num < min) || (max && num > max)) {
    throw new Error(`Out of range: ${num}`);
  }

  return num;
};


module.exports.string = (str) => {
  if (!str || typeof str !== 'string') {
    throw new Error(`String format expected: ${str}`);
  }

  return str;
};


module.exports.bool = (value) => {
  if (!value || typeof value !== 'boolean') {
    throw new Error(`Boolean format expected: ${value}`);
  }

  return value;
};
