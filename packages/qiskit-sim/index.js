/**
 * @license
 *
 * Copyright (c) 2017, IBM.
 *
 * This source code is licensed under the Apache License, Version 2.0 found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const gateSingle = require('./lib/gateSingle');
const gateTwo = require('./lib/gateTwo');
const run = require('./lib/run');
const state0 = require('./lib/state0');
const { version } = require('./package');

module.exports = {
  version,
  gateSingle,
  gateTwo,
  run,
  state0,
};
