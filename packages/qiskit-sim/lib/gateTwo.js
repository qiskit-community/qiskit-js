/*
  Copyright IBM Corp. 2017. All Rights Reserved.

  This code may only be used under the Apache 2.0 license found at
  http://www.apache.org/licenses/LICENSE-2.0.txt.

  Authors:
  - John Smolin (original code)
  - Jay Gambetta (original code)
  - Ismael Faro <Ismael.Faro1@ibm.com>
  - Jesús Pérez <jesusper@us.ibm.com>
*/

'use strict';

const assert = require('assert');

const math = require('mathjs');

const utils = require('./utils');

const dbg = utils.dbg(__filename);

// TODO: Add tests.

// Get the first value for the index to insert the new value in each loop.
// Takes a bitstring k and inserts bit b as the ith bit,
// shifting bits >= i over to make room.
function index1(b, i, k) {
  let res = k;

  // Get the low i bits.
  /* eslint-disable no-bitwise */
  const lowbits = k & ((1 << i) - 1);

  res >>= i;
  res <<= 1;

  res |= b;

  res <<= i;
  res |= lowbits;
  /* eslint-enable no-bitwise */

  return res;
}

// Takes a bitstring k and inserts bits b1 as the i1th bit
// and b2 as the i2th bit
function index2(b1, i1, b2, i2, k) {
  // TODO: Why? Emit a proper error.
  assert(i1 !== i2);

  let res;

  if (i1 > i2) {
    // insert as(i1 - 1) th bit,will be shifted left 1 by next line
    res = index1(b1, i1 - 1, k);
    res = index1(b2, i2, res);
  } else {
    // i2 > i1 --> insert as(i2 - 1) th bit, will be shifted left 1 by next line
    res = index1(b2, i2 - 1, k);
    res = index1(b1, i1, res);
  }

  return res;
}

module.exports = (gate, qubit0, qubit1, numQbits, state) => {
  // eslint-disable-next-line no-bitwise
  const enlargeOpt = math.zeros(1 << numQbits, 1 << numQbits);

  dbg('Starting "addUnitaryTwo" with opions', {
    gate,
    qubit0,
    qubit1,
    numQbits,
  });

  dbg('\n\nState before\n\n');
  dbg(state.toString());

  dbg('\n\nEnlarge before\n\n');
  dbg(enlargeOpt.toString());

  dbg('Position 0,0 before', enlargeOpt.get([0, 0]));

  // TODO: Can we optimize this? http://mathjs.org/docs/datatypes/matrices.html#iterating
  // eslint-disable-next-line no-bitwise
  for (let i = 0; i < 1 << (numQbits - 2); i += 1) {
    for (let j = 0; j < 2; j += 1) {
      for (let k = 0; k < 2; k += 1) {
        for (let jj = 0; jj < 2; jj += 1) {
          for (let kk = 0; kk < 2; kk += 1) {
            const idx0 = index2(j, qubit0, k, qubit1, i);
            const idx1 = index2(jj, qubit0, kk, qubit1, i);
            const newValue = gate.get([j + 2 * k, jj + 2 * kk]);

            dbg('Turn for:', { idx0, idx1, newValue });
            enlargeOpt.set([idx0, idx1], newValue);
          }
        }
      }
    }
  }

  dbg('\n\nEnlarge after\n\n');
  dbg(enlargeOpt.toString());

  dbg('\n\nState after\n\n');
  dbg(state.toString());

  dbg('Position 0,0 after', enlargeOpt.get([0, 0]));

  return math.multiply(enlargeOpt, state);
};
