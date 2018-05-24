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
