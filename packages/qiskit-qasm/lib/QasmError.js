/**
 * @license
 *
 * Copyright (c) 2017, IBM.
 *
 * This source code is licensed under the Apache License, Version 2.0 found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

class QasmError extends Error {

  constructor(message, opts = {}) {
    if (!message) {
      throw new TypeError('Required param: message');
    }
    super(message);
    this.name = 'QasmError';

    // TODO: Review: error code, etc? If coming from jison X ours Y
    if (opts.line) {
      this.line = opts.line;
      this.message += ` (line:${this.line})`;
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

}

module.exports = QasmError;
