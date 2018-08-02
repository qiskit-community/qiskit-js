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
const utilsTest = require('../../../../utils-test');

const Cloud = require('../..');
const expErrRegex = require('../errorRe');

describe('cloud:credits', () => {
  it('should fail if no logged', async () =>
    utilsTest.throwsAsync(
      () => new Cloud().credits(),
      expErrRegex.loginBefore,
    ));

  it('should return the info of my credits in the platform', async function t() {
    if (!global.qiskit || !global.qiskit.cloud) {
      this.skip();
    }

    const res = await global.qiskit.cloud.credits();

    assert.deepEqual(Object.keys(res), [
      'promotional',
      'remaining',
      'maxUserType',
    ]);
    assert.equal(typeof res.promotional, 'number');
    assert.equal(typeof res.remaining, 'number');
    assert.equal(typeof res.maxUserType, 'number');
  });
});
