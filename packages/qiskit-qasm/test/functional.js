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

const qasm = require('..');
const pkgInfo = require('../package');
const parse = require('../lib/parse');
const QasmError = require('../lib/QasmError');


// TODO: It starts to be quite big -> create a folder with a file for any "describe".

describe('qasm:version', () =>
  it('should return the package version', () => assert.equal(qasm.version, pkgInfo.version)));


describe('qasm:parse', () => {
  // TODO: Implement
  it('should fail without param', () => {
    assert.throws(
      () => { parse(); },
      // eslint-disable-next-line comma-dangle
      /Required param: circuit/
    );
  });

  const expected = [
    { type: 'qubit', identifier: 'q', number: '5' },
    { type: 'clbit', identifier: 'c', number: '5' },
    { type: 'x', identifiers: [{ name: 'q', index: '0' }] },
    { type: 'measure', qreg: { name: 'q' }, creg: { name: 'c' } },
  ];
  const circuitSimple = 'qreg q[1];\n' +
                        'creg c[1];\n' +
                        'measure q->c;\n';

  // TODO: Review the spec.
  it.skip('should work with "IBMQASM 2.0" as version header', () => {
    const circuit = `IBMQASM 2.0;\n${circuitSimple}`;

    const res = parse(circuit);
    assert.deepEqual(res, expected);
  });

  it.skip('should work with with "OPENQASM 2.0" as version header', () => {
    const circuit = `OPENQASM 2.0;\n${circuitSimple}`;

    assert.deepEqual(parse(circuit), expected);
  });

  it.skip('should fail with any other version header', () => {
    const circuit = 'A 2.0;\n';
    // TODO: More cases
    // const circuit = 'OPENQASM 1.0;\n';
    // const circuit = 'A 1.0;\n';
    // const circuit = 'A';

    // TODO: Not working.
    // assert.throws(
    //   () => { parse(circuit); },
    //   // eslint-disable-next-line comma-dangle
    //   /Lexical error on line 1: Unrecognized text/
    // );
    assert.throws(() => { parse(circuit); });
  });

  it.skip('should fail with no version header', () => {
    const circuit = 'qreg q[5];\n' +
                    'creg c[5];\n' +
                    'x q[0];\n' +
                    'measure q -> c;';

    // TODO: Not working.
    // assert.throws(
    //   () => { parse(circuit); },
    //   // eslint-disable-next-line comma-dangle
    //   /Lexical error on line 1: Unrecognized text/
    // );
    assert.throws(() => { parse(circuit); });
  });

  // TODO: Not working.
  it.skip('should work with "include"', () => {
    const circuit = 'OPENQASM 2.0;\n' +
                    'include "qelib1.inc";\n' +
                    'qreg q[5];\n' +
                    'creg c[5];\n' +
                    'x q[0];\n' +
                    'measure q -> c;';

    const expectedC = 'TODO';

    assert.deepEqual(parse(circuit), expectedC);
  });
});


// TODO: Test for comments.

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
