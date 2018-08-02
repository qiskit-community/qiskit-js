/**
 * @license
 *
 * Copyright (c) 2017, IBM.
 *
 * This source code is licensed under the Apache License, Version 2.0 found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const path = require('path');
const assert = require('assert');
const exec = require('child_process').execSync;

const binPath = path.resolve(__dirname, '../../bin/index.js');
const comm = `node ${binPath}`;
const pkgInfo = require('../../package');
const utilsTest = require('../../../../utils-test');

const reGot0 = /Not enough non-option arguments: got 0/;
const reNotSup = /Format not supported/;

function assertComm(re, result) {
  assert.ok(re.test(utilsTest.strip(result.toString()).replace(/ /g, '')));
}

describe('qiskit:bin', () => {
  it('should fail if no params', () => assert.throws(() => exec(comm), reGot0));

  it('should work for "--version"', () =>
    assertComm(new RegExp(pkgInfo.version), exec(`${comm} --version`)));

  it('should work for "--help"', () =>
    assertComm(/parse<circuit>ParsethecircuittoourIR/, exec(`${comm} --help`)));

  it('should work for "parse" command', () =>
    assertComm(
      /-\ntype:qubit\nidentifier:q\nnumber:3/,
      exec(`${comm} parse ../../circuits/example.qasm`),
    ));

  it('should fail for "parse" command without arguments', () =>
    assert.throws(() => exec(`${comm} parse`), reGot0));

  // TODO: Waiting to finish the new simulator implementation.
  it.skip('should work for "sim" command with unrolled circuits', () => {
    assertComm(
      /State\|psi>=U|0>:\[0.35355339059327384,0/,
      exec(`${comm} sim ../../circuits/unrolled/example.json`),
    );
  }).timeout(5000);

  it('should fail for "sim" command without arguments', () =>
    assert.throws(() => exec(`${comm} sim`), reGot0));

  it('should fail for "sim" command with any other format', () => {
    assert.throws(() => exec(`${comm} sim whatever.png`), reNotSup);
  });

  it('should fail for "cloud-job" command without arguments', () =>
    assert.throws(() => exec(`${comm} cloud-job`), reGot0));

  it('should fail for "cloud-run" command without arguments', () =>
    assert.throws(() => exec(`${comm} cloud-run`), reGot0));
});
