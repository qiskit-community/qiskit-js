/*
  Copyright IBM Corp. 2017. All Rights Reserved.

  This code may only be used under the Apache 2.0 license found at
  http://www.apache.org/licenses/LICENSE-2.0.txt.

  Authors:
  - Jesús Pérez <jesusper@us.ibm.com>
*/

'use strict';

const assert = require('assert');
const utilsTest = require('../../../../utils-test');

const Qe = require('../..');
const expErrRegex = require('../errorRe');


// Already logged instance.
const { qe } = global.qiskitTest;


describe('qe:credits', () => {
  it('should fail if no logged', async () =>
    utilsTest.throwsAsync(() => new Qe().credits(), expErrRegex.loginBefore));

  it('should return the info of my credits in the platform', async function t() {
    if (!global.qiskitTest.integration) { this.skip(); }

    const res = await qe.credits();

    assert.deepEqual(Object.keys(res), ['promotional', 'remaining', 'maxUserType']);
    assert.equal(typeof res.promotional, 'number');
    assert.equal(typeof res.remaining, 'number');
    assert.equal(typeof res.maxUserType, 'number');
  });
});
