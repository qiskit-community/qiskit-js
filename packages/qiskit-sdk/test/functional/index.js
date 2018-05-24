/*
  Copyright IBM Corp. 2017. All Rights Reserved.

  This code may only be used under the Apache 2.0 license found at
  http://www.apache.org/licenses/LICENSE-2.0.txt.

  Authors:
  - Jesús Pérez <jesusper@us.ibm.com>
*/

'use strict';

const assert = require('assert');

const qiskit = require('../..');

const pkgInfo = require('../../package');
const pkgInfoSim = require('../../../qiskit-sim/package');

describe('qiskit:api', () => {
  it('should include all documented items', () =>
    assert.deepEqual(Object.keys(qiskit), [
      'version',
      'qasm',
      'sim',
      'Cloud',
      'utils',
      'algos',
    ]));

  it('should return the the correct result for its methods', () =>
    assert.equal(qiskit.version, pkgInfo.version));

  // We only check one for convenience.
  it('should return the correct result for any item', () =>
    assert.equal(qiskit.sim.version, pkgInfoSim.version));
});
