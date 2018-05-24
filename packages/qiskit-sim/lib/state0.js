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

// TODO: Add to the documentation.
module.exports = state => {
  const quantumState = math
    .chain(math.zeros(state.toJSON().size[0]))
    .multiply(math.complex(1, 0))
    .done();
  quantumState.set([0], 1);

  return math.multiply(state, quantumState).toJSON();
};
