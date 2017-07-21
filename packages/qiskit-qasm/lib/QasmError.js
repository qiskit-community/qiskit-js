/*
  Copyright IBM Corp. 2017. All Rights Reserved.

  This code may only be used under the Apache 2.0 license found at
  http://www.apache.org/licenses/LICENSE-2.0.txt.

  Authors:
  - Jesús Pérez <jesusper@us.ibm.com>
*/

'use strict';

const util = require('util');


function QasmError(msg, opts = {}) {
  Error.captureStackTrace(this, this.constructor);

  this.name = this.constructor.name;

  if (!msg) { throw new Error('Required param: msg'); }

  this.message = msg;

  // TODO: Review: error code, etc? If coming from jison X ours Y
  if (opts.line) { this.line = opts.line; }
  if (opts.column) { this.column = opts.column; }
  if (opts.text) { this.text = opts.text; }
  if (opts.token) { this.token = opts.token; }
  if (opts.expected) { this.expected = opts.expected; }
}


util.inherits(QasmError, Error);

module.exports = QasmError;
