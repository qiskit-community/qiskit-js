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

// eslint-disable-next-line import/no-extraneous-dependencies
const Cloud = require('@qiskit/cloud');

const devs = require('..');
const { version } = require('../package');

const cloud = new Cloud();
global.qiskit = {};

// TODO: Use utils.difference instead.
function multiIncludes(text, values) {
  return values.every(val => text.includes(val));
}

describe('devs:ibm:api', () => {
  it('should include all documented items', () => {
    assert.ok(multiIncludes(Object.keys(devs), ['random', 'result']));
  });

  it('should return the the correct result for its methods', () =>
    assert.equal(devs.version, version));
});

describe('devs:ibm:version', () =>
  it('should be correct', () => assert.equal(devs.version, version)));

let jobId;
describe('devs:ibm:random', () => {
  before(async function t() {
    if (!process.env.QX_KEY) {
      cloud.token = 'notvalid';
      cloud.userId = 'notvalid';

      /* eslint-disable no-console */
      console.log(
        '\n\n\n\t-------------------------------------------------------------',
      );
      console.log('\tWARNING');
      console.log('\tQX_KEY env var not found, so skipping integration tests.');
      console.log(
        '\t-------------------------------------------------------------\n\n\n',
      );
      /* eslint-enable no-console */

      this.skip();
    }

    global.qiskit.cloud = cloud;
    await cloud.login(process.env.QX_KEY);
  });

  it('should return a jobId', async () => {
    if (!global.qiskit || !global.qiskit.cloud) {
      this.skip();
    }

    const res = await devs.random({ custom: cloud });
    assert.equal(typeof res, 'string');
    assert(res.length >= 0);

    jobId = res;
  });
});

describe('devs:ibm:result', () => {
  it('should return the result passing jobId', async function t() {
    if (!global.qiskit || !global.qiskit.cloud) {
      this.skip();
    }

    const res = await devs.result(jobId, { custom: cloud });

    assert.equal(res.status, 'running');
  });
});
