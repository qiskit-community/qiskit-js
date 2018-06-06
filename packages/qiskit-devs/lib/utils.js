/**
 * @license
 *
 * Copyright (c) 2017-present, IBM Research.
 *
 * This source code is licensed under the Apache license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const utils = require('@qiskit/utils');

const pkgName = require('../package.json').name;

utils.dbg = fullPath => utils.debug(`${pkgName}:${utils.pathToTag(fullPath)}`);

module.exports = utils;
