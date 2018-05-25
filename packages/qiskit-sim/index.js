/**
 * @license
 *
 * Copyright (c) 2017-present, IBM Research.
 *
 * This source code is licensed under the Apache license found in the
 * LICENSE.txt file in the root directory of this source tree.
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
