/**
 * @license
 *
 * Copyright (c) 2017, IBM.
 *
 * This source code is licensed under the Apache License, Version 2.0 found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const Parser = require('./lib/Parser');
const QasmError = require('./lib/QasmError');
const { version } = require('./package');

module.exports = {
  version,
  Parser,
  QasmError,
};
