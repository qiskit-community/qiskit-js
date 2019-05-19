/**
 * @license
 *
 * Copyright (c) 2017, IBM.
 *
 * This source code is licensed under the Apache License, Version 2.0 found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const assert = require('assert');
// const util = require('util');
const QasmError = require('../../lib/QasmError');

describe('qasm:QasmError', () => {
  it('should return the error with a message and all options', () => {
    const msg = 'test msg';
    const opts = {
      line: 24,
      column: 5,
      text: 'a',
      token: 'b',
      expected: 'other',
    };

    const err = new QasmError(msg, opts);

    assert.equal(err.name, 'QasmError');
    assert.equal(err.message, `${msg} (line:${opts.line})`);
    assert.equal(typeof err.stack, 'string');
    assert.equal(err.line, 24);
    assert.equal(err.column, 5);
    assert.equal(err.text, 'a');
    assert.equal(err.token, 'b');
    assert.equal(err.expected, 'other');
  });

  it('should return the error with a message and without all options', () => {
    const msg = 'test msg';
    const opts = {
      line: 24,
    };

    const err = new QasmError(msg, opts);

    assert.equal(err.name, 'QasmError');
    assert.equal(typeof err.stack, 'string');
    assert.equal(err.message, `${msg} (line:${opts.line})`);
    assert.equal(err.line, 24);
    assert.equal(err.column, undefined);
    assert.equal(err.text, undefined);
    assert.equal(err.token, undefined);
    assert.equal(err.expected, undefined);
  });

  it('should return the error with a message and without any option', () => {
    const msg = 'test msg';

    const err = new QasmError(msg);

    assert.equal(err.name, 'QasmError');
    assert.equal(typeof err.stack, 'string');
    assert.equal(err.message, msg);
    assert.equal(err.column, undefined);
    assert.equal(err.text, undefined);
    assert.equal(err.token, undefined);
    assert.equal(err.expected, undefined);
  });

  it('should fail without a message', () => {
    assert.throws(() => new QasmError(), /Required param: message/);
  });
});
