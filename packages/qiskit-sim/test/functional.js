#!/usr/bin/env node

/*
  Copyright IBM Corp. 2017. All Rights Reserved.

  This code may only be used under the Apache 2.0 license found at
  http://www.apache.org/licenses/LICENSE-2.0.txt.

  Authors:
  - Jesús Pérez <jesusper@us.ibm.com>
*/

'use strict';

const assert = require('assert');

const sim = require('..');
const circuit = require('../../../circuits/unrolled/example.json');
const pkgInfo = require('../package');


const res = sim.run(circuit);


describe('sim:version', () => {
  it('should return the package version', () => assert.equal(sim.version, pkgInfo.version));
});


describe('sim:run', () => {
  it('should work with the example file', () => {
    const stateJson = res.state.toJSON();
    const expectedDrops = [
      { name: 'barrier', qubits: [0, 1, 2] },
      { clbits: [0], name: 'measure', qubits: [0] },
      { clbits: [1], name: 'measure', qubits: [1] },
      { clbits: [2], name: 'measure', qubits: [2] },
      { clbits: [3], name: 'measure', qubits: [3] },
      { clbits: [4], name: 'measure', qubits: [4] },
      { clbits: [5], name: 'measure', qubits: [5] },
    ];

    assert.deepEqual(stateJson.size, [64, 64]);

    assert.deepEqual(res.drops, expectedDrops);

    // Checking only some of them because is huge.
    // In the next test we look for full coincidence.
    assert.equal(stateJson.data[0][0].re, 0.35355339059327384);
    assert.equal(stateJson.data[0][0].im, 0);
    // TODO: Do we have problems with precision? Maybe we should use bigints (math.js)
    assert.equal(stateJson.data[0][1].re, 0.3535533905932738);
    assert.equal(stateJson.data[0][1].im, -4.329780281177467e-17);
    assert.notEqual(stateJson.data[0][7].re, 0);
    assert.notEqual(stateJson.data[0][7].im, 0);
    assert.equal(stateJson.data[0][8].re, 0);
    assert.equal(stateJson.data[0][8].im, 0);
    assert.equal(stateJson.data[0][9].re, 0);
    assert.equal(stateJson.data[0][9].im, 0);
    assert.equal(stateJson.data[1][0].re, 0);
    assert.equal(stateJson.data[1][0].im, 0);
    assert.equal(stateJson.data[1][1].re, 0);
    assert.equal(stateJson.data[1][1].im, 0);
    assert.equal(stateJson.data[1][8].re, 0.3535533905932738);
    assert.equal(stateJson.data[1][8].im, 0);
    assert.equal(stateJson.data[1][9].re, -0.35355339059327384);
    assert.equal(stateJson.data[1][9].im, 4.3297802811774677e-17);
  });


  it('should provide data to calculate the state |psi> = U|0>', () => {
    const expected = [
      { re: 0.35355339059327384, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0.3535533905932738, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0.3535533905932738, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0.35355339059327373, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0.3535533905932738, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0.35355339059327373, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0.35355339059327373, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 0.3535533905932737, im: 0 },
    ];

    const state0 = sim.state0(res.state);

    assert.deepEqual(state0.size, [64]);
    assert.deepEqual(state0.data, expected);
  });


  it('should fail if a circuit is not passed', () => {
    assert.throws(
      () => { sim.run(); },
      // eslint-disable-next-line comma-dangle
      /Empty circuit/
    );
  });


  it('should fail with a parsing error if a not supported operation is found', () => {
    assert.throws(
      () => { sim.run({ operations: [{ name: 'nonexistent' }] }); },
      // eslint-disable-next-line comma-dangle
      /Parsing error/
    );
  });
});
