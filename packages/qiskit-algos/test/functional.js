/**
 * @license
 *
 * Copyright (c) 2017-present, IBM Research.
 *
 * This source code is licensed under the Apache license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const assert = require('assert');

const Cloud = require('@qiskit/cloud');

const algos = require('..');
const { version } = require('../package');

const cloud = new Cloud();

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

// TODO: this is not the best solution, we're repeting things in @qiskit/cloud tests.
describe('algos:result:random', () => {
  it('should return the result passing jobId', async function t() {
    if (!process.env.QE_TOKEN || !process.env.QE_USER) {
      // Dirty trick to allow the tests which don´t need the API to run.
      cloud.token = 'notvalid';
      cloud.userId = 'notvalid';

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
