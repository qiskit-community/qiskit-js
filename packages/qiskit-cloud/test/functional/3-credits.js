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

const Qe = require('../..');
const expErrRegex = require('../errorRe');

// Already logged instance.
const { cloud } = global.qiskitTest;

describe('cloud:credits', () => {
  it('should fail if no logged', async () =>
    utilsTest.throwsAsync(() => new Qe().credits(), expErrRegex.loginBefore));

  it('should return the info of my credits in the platform', async function t() {
    if (!global.qiskitTest.integration) {
      this.skip();
    }

    const res = await cloud.credits();

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
