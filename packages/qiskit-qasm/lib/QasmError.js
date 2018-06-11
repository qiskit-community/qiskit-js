/**
 * @license
 *
 * Copyright (c) 2017, IBM.
 *
 * This source code is licensed under the Apache License, Version 2.0 found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const util = require('util');

function QasmError(msg, opts = {}) {
  Error.captureStackTrace(this, this.constructor);

  this.name = this.constructor.name;

  if (!msg) {
    throw new Error('Required param: msg');
  }

  this.message = msg;

  // TODO: Review: error code, etc? If coming from jison X ours Y
  if (opts.line) {
    this.line = opts.line;
  }
  if (opts.column) {
    this.column = opts.column;
  }
  if (opts.text) {
    this.text = opts.text;
  }
  if (opts.token) {
    this.token = opts.token;
  }
  if (opts.expected) {
    this.expected = opts.expected;
  }
}

util.inherits(QasmError, Error);

module.exports = QasmError;
