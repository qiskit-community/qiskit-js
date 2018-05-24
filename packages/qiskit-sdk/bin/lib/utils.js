/*
  Copyright IBM Corp. 2017. All Rights Reserved.

  This code may only be used under the Apache 2.0 license found at
  http://www.apache.org/licenses/LICENSE-2.0.txt.

  Authors:
  - Jesús Pérez <jesusper@us.ibm.com>
*/

'use strict';

const utils = require('@qiskit/utils');

const pkgName = require('../../package.json').name;

utils.dbg = fullPath => utils.debug(`${pkgName}:${utils.pathToTag(fullPath)}`);

module.exports = utils;
