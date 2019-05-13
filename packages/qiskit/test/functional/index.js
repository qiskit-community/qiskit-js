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
      'algo',
    ]));

  it('should return the the correct result for its methods', () =>
    assert.equal(qiskit.version, pkgInfo.version));

  // We only check one for convenience.
  it('should return the correct result for any item', () =>
    assert.equal(qiskit.sim.version, pkgInfoSim.version));
});
