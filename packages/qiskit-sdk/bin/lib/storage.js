/*
  Copyright IBM Corp. 2017. All Rights Reserved.

  This code may only be used under the Apache 2.0 license found at
  http://www.apache.org/licenses/LICENSE-2.0.txt.

  Authors:
  - Jesús Pérez <jesusper@us.ibm.com>
*/

'use strict';

const path = require('path');

const storage = require('node-persist');
const homeOrTmp = require('home-or-tmp');

const logger = require('./logger');

try {
  storage.initSync({ dir: path.resolve(homeOrTmp, '.qiskit') });
} catch (err) {
  logger.error('Starting the persistent storage', err);
  process.exit(1);
}

module.exports = storage;
