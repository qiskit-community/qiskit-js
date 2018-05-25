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

// TODO: Add to the documentation.
module.exports = state => {
  const quantumState = math
    .chain(math.zeros(state.toJSON().size[0]))
    .multiply(math.complex(1, 0))
    .done();
  quantumState.set([0], 1);

  return math.multiply(state, quantumState).toJSON();
};
