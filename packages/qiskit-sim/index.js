/*
  Copyright IBM Corp. 2017. All Rights Reserved.

  This code may only be used under the Apache 2.0 license found at
  http://www.apache.org/licenses/LICENSE-2.0.txt.

  Authors:
  - Jesús Pérez <jesusper@us.ibm.com>
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
