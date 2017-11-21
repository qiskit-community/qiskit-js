/*
  Copyright IBM Corp. 2017. All Rights Reserved.

  This code may only be used under the Apache 2.0 license found at
  http://www.apache.org/licenses/LICENSE-2.0.txt.

  Authors:
  - Jesús Pérez <jesusper@us.ibm.com>
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
    assert.equal(err.message, msg);
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
    assert.equal(err.message, msg);
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
    assert.throws(
      // eslint-disable-next-line no-new
      () => { new QasmError(); },
      // eslint-disable-next-line comma-dangle
      /Required param: msg/
    );
  });
});
