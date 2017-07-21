/*
  Copyright IBM Corp. 2017. All Rights Reserved.

  This code may only be used under the Apache 2.0 license found at
  http://www.apache.org/licenses/LICENSE-2.0.txt.

  Authors:
  - Jesús Pérez <jesusper@us.ibm.com>
*/

'use strict';

const path = require('path');
const assert = require('assert');
const exec = require('child_process').execSync;


const binPath = path.resolve(__dirname, '../../bin/index.js');
const comm = `node ${binPath}`;
const pkgInfo = require('../../package');

const reGot0 = /Not enough non-option arguments: got 0/;
const reGot1 = /Not enough non-option arguments: got 1/;
const reNotSup = /Regular QASM circuits are still not supported/;


function assertComm(re, result) {
  assert.ok(re.test(result.toString().replace(/ /g, '')));
}


describe('qiskit:cli', () => {
  it('should fail if no params', () =>
    assert.throws(() => exec(comm), reGot0));

  it('should work for "--version"', () =>
    assertComm(new RegExp(pkgInfo.version), exec(`${comm} --version`)));

  it('should work for "--help"', () =>
    assertComm(
      /Commands:\nparse<circuit>ParsethecircuittoourintermediateJSONformat\n\[aliases:p\]/,
      // eslint-disable-next-line comma-dangle
      exec(`${comm} --help`)
    ));

  it('should work for "parse" command', () =>
    assertComm(
      /-\ntype:qubit\nidentifier:q\nnumber:3/,
      // eslint-disable-next-line comma-dangle
      exec(`${comm} parse ../../circuits/example.qasm`)
    ));

  it('should fail for "parse" command without arguments', () =>
    assert.throws(() => exec(`${comm} parse`), reGot0));

  it('should work for "sim" command with unrolled circuits', () => {
    assertComm(
      /State\|psi>=U|0>:\[0.35355339059327384,0/,
      // eslint-disable-next-line comma-dangle
      exec(`${comm} sim ../../circuits/unrolled/example.json true`)
    );
  }).timeout(5000);

  it('should fail for "sim" command without arguments', () =>
    assert.throws(() => exec(`${comm} sim`), reGot0));

  it('should fail for "sim" command with non-unrolled circuits', () => {
    assert.throws(() => exec(`${comm} sim whatever`), reNotSup);
  });


  // TODO: qe, unroll working


  it('should fail for "unroll" command without arguments', () =>
    assert.throws(() => exec(`${comm} unroll`), reGot0));

  it('should fail for "qe" command without arguments', () =>
    assert.throws(() => exec(`${comm} qe`), reGot0));

  it('should fail for "qe" command with only one argument', () =>
    assert.throws(() => exec(`${comm} qe whatever`), reGot1));
});
