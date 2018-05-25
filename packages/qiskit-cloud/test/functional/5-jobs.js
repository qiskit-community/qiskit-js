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
const utilsTest = require('../../../../utils-test');

const Qe = require('../..');
const expErrRegex = require('../errorRe');

// Already logged instance.
const { cloud } = global.qiskitTest;

function checkJob(res) {
  assert.deepEqual(Object.keys(res), [
    'id',
    'backend',
    'shots',
    'creationDate',
    'usedCredits',
    'status',
    'circuits',
  ]);
  assert.equal(typeof res.id, 'string');
  assert.equal(typeof res.backend, 'string');
  assert.equal(typeof res.shots, 'number');
  assert.equal(typeof res.creationDate, 'string');
  assert.equal(typeof res.usedCredits, 'number');
  assert.equal(typeof res.status, 'string');
  assert.equal(res.circuits.length, 1);
  assert.deepEqual(Object.keys(res.circuits[0]), [
    'qasm',
    'execution',
    'result',
  ]);
  assert.equal(typeof res.circuits[0].qasm, 'string');
  assert.deepEqual(Object.keys(res.circuits[0].execution), ['id', 'status']);
  assert.equal(typeof res.circuits[0].execution.id, 'string');
  assert.equal(typeof res.circuits[0].execution.status, 'string');
  // Maybe it has not finished.
  if (res.circuits[0].execution.result) {
    assert.deepEqual(Object.keys(res.circuits[0].execution.result), [
      'date',
      'data',
    ]);
    assert.equal(typeof res.circuits[0].execution.result.date, 'string');
    assert.deepEqual(Object.keys(res.circuits[0].execution.result.data), [
      'time',
      'count',
    ]);
    assert.equal(typeof res.circuits[0].execution.result.data.time, 'string');
    assert.equal(typeof res.circuits[0].execution.result.data.count, 'object');
  }
}

describe('cloud:job', () => {
  it('should fail if no logged', async () =>
    utilsTest.throwsAsync(() => new Qe().job(), expErrRegex.loginBefore));

  it('should fail if "id" parameter no present', async () =>
    utilsTest.throwsAsync(() => cloud.job(), expErrRegex.formatStr));

  it('should fail if bad format in the "id" parameter', async () =>
    utilsTest.throwsAsync(() => cloud.job(1), expErrRegex.formatStr));

  it('should return the info for a valid job', async function t() {
    if (!global.qiskitTest.integration) {
      this.skip();
    }

    const res = await cloud.job(global.qiskitTest.jobId);
    checkJob(res);
  });
});

let oldId;
describe('cloud:jobs', () => {
  it('should fail if no logged', async () =>
    utilsTest.throwsAsync(() => new Qe().jobs(), expErrRegex.loginBefore));

  it('should fail if bad format in the "limit" option', async () =>
    utilsTest.throwsAsync(() => cloud.jobs('a'), expErrRegex.formatNumber));

  it('should fail if under min. in the "limit" option', async () =>
    utilsTest.throwsAsync(() => cloud.jobs(-1), expErrRegex.outRange));

  it('should fail if bad format in the "offset" option', async () =>
    utilsTest.throwsAsync(() => cloud.jobs(1, 'a'), expErrRegex.formatNumber));

  it('should fail if under min. in the "offset" option', async () =>
    utilsTest.throwsAsync(() => cloud.jobs(1, -1), expErrRegex.outRange));

  it('should return all jobs info without parameters', async function t() {
    if (!global.qiskitTest.integration) {
      this.skip();
    }

    const res = await cloud.jobs();

    assert.ok(res.length > 1);
    checkJob(res[0]);
  });

  it('should return selected number of jobs info with "limit" parameter', async function t() {
    if (!global.qiskitTest.integration) {
      this.skip();
    }

    const res = await cloud.jobs(1);

    assert.equal(res.length, 1);
    checkJob(res[0]);
    oldId = res[0].id;
  });

  it('should skip selected number of jobs info with "offset" parameter', async function t() {
    if (!global.qiskitTest.integration) {
      this.skip();
    }

    const res = await cloud.jobs(1, 1);

    assert.equal(res.length, 1);
    checkJob(res[0]);
    assert.notEqual(res[0].id, oldId);
  });
});
