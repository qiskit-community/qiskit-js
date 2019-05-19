/**
 * @license
 *
 * Copyright (c) 2017, IBM.
 *
 * This source code is licensed under the Apache License, Version 2.0 found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const utils = require('@qiskit/utils');

const genHex = require('./lib/genHex');
const { version } = require('./package');

module.exports.version = version;

module.exports.random = async opts => utils.genRandom(genHex, opts);
