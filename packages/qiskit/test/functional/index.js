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


const pkgInfo = require('../../../qiskit-sim/package');


describe('qiskit:api', () => {
  it('should include all subpackages', () =>
    assert.deepEqual(Object.keys(qiskit), ['version', 'qasm', 'sim', 'qe']));

  it('should return the the correct result for its methods', () =>
    assert.equal(qiskit.version, pkgInfo.version));

  it('should return the correct result for any subpackage', () =>
    assert.equal(qiskit.sim.version, pkgInfo.version));
});
