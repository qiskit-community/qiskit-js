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

const sim = require('../..');
const pkgInfo = require('../../package');

describe('sim:index', () => {
  it('should include all documented root elements', () => {
    assert.deepEqual(Object.keys(sim), ['version', 'gates', 'Gate', 'Circuit']);
  });
});

describe('sim:version', () => {
  it('should return the package version', () => {
    assert.equal(sim.version, pkgInfo.version);
  });
});
