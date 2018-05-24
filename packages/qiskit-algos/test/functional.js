/*
  Copyright IBM Corp. 2017. All Rights Reserved.

  This code may only be used under the Apache 2.0 license found at
  http://www.apache.org/licenses/LICENSE-2.0.txt.

  Authors:
  - Jesús Pérez <jesusper@us.ibm.com>
*/

'use strict';

const assert = require('assert');

const Qe = require('@qiskit/qe');

const algos = require('..');
const { version } = require('../package');

const qe = new Qe();

// TODO: Use utils.difference instead.
function multiIncludes(text, values) {
  return values.every(val => text.includes(val));
}

describe('algos:api', () => {
  it('should include all documented items', () => {
    assert.ok(multiIncludes(Object.keys(algos), ['random', 'result']));
  });

  it('should return the the correct result for its methods', () =>
    assert.equal(algos.version, version));
});

describe('algos:version', () =>
  it('should be correct', () => assert.equal(algos.version, version)));

// TODO: this is not the best solution, we're repeting things in @qiskit/qe tests.
describe('algos:result:random', () => {
  it('should return the result passing jobId', async function t() {
    if (!process.env.QE_TOKEN || !process.env.QE_USER) {
      // Dirty trick to allow the tests which don´t need the API to run.
      qe.token = 'notvalid';
      qe.userId = 'notvalid';

      /* eslint-disable no-console */
      console.log(
        '\n\n\n\t-------------------------------------------------------------',
      );
      console.log('\tWARNING');
      console.log(
        '\tQE_TOKEN env var not found, so skipping integration tests.',
      );
      console.log(
        '\t-------------------------------------------------------------\n\n\n',
      );
      /* eslint-enable no-console */

      this.skip();
    }

    global.qiskitTestAlgos = { integration: true };

    const res = await algos.result(
      process.env.QE_TOKEN,
      process.env.USER_ID,
      // TODO
      // jobId
    );

    assert.equal(res.status, 'completed');
    assert.ok(res.data >= 0);
    assert.ok(res.data <= 1);
  });
});
