/**
 * @license
 *
 * Copyright (c) 2017, IBM.
 *
 * This source code is licensed under the Apache License, Version 2.0 found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const { version } = require('./package');
const { Gate, gates } = require('./lib/gates');
const Circuit = require('./lib/Circuit');

module.exports = {
  version,
  gates,
  Gate,
  Circuit,
};
