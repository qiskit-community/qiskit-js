/**
 * @license
 *
 * Copyright (c) 2017-present, IBM Research.
 *
 * This source code is licensed under the Apache license found in the
 * LICENSE.txt file in the root directory of this source tree.
 *
 * Authors original code:
 * - John Smolin
 * - Jay Gambetta
 * - Ismael Faro
 */

// TODO: Add tests.

'use strict';

const math = require('mathjs');

const complex = math.complex(1, 0);

module.exports = (gate, qubit, nQubits, state) => {
  const temp1 = math
    .chain(math.eye(math.pow(2, nQubits - qubit - 1)))
    .multiply(complex)
    .done();
  const temp2 = math
    .chain(math.eye(math.pow(2, qubit)))
    .multiply(complex)
    .done();
  const enlargeOpt = math.kron(temp1, math.kron(gate, temp2));

  return math.multiply(enlargeOpt, state);
};
