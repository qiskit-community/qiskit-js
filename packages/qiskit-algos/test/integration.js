/*
  Copyright IBM Corp. 2017. All Rights Reserved.

  This code may only be used under the Apache 2.0 license found at
  http://www.apache.org/licenses/LICENSE-2.0.txt.

  Authors:
  - Jesús Pérez <jesusper@us.ibm.com>
*/

'use strict';

const assert = require('assert');

const genBin = require('../lib/genBin');

describe('algos:genBin', () => {
  it('should return a jobId', async function t() {
    if (!global.qiskitTestAlgos || !global.qiskitTestAlgos.integration) {
      this.skip();
    }
    const res = await genBin(process.env.QE_TOKEN, process.env.USER_ID);

    assert.equal(typeof res, 'string');
    assert.equal(res.length, 32);
  });
});
