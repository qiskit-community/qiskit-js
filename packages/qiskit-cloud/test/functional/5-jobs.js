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

const utils = require('../../lib/utils');
const utilsTest = require('../../../../utils-test');

const Cloud = require('../..');
const expErrRegex = require('../errorRe');

const cloudFaked = new Cloud();
cloudFaked.token = 'a';
cloudFaked.userId = 'a';

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
  // "result" can be present or not.
  assert.equal(
    utils.difference(['qasm', 'execution'], Object.keys(res.circuits[0])),
    0,
  );
  assert.equal(typeof res.circuits[0].qasm, 'string');

  // If job has errored this is not present (execution) or Maybe it has still not finished (result).
  if (!res.circuits[0].execution.result) {
    return;
  }

  assert.deepEqual(Object.keys(res.circuits[0].execution), ['id', 'status']);
  assert.equal(typeof res.circuits[0].execution.id, 'string');
  assert.equal(typeof res.circuits[0].execution.status, 'string');

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

describe('cloud:job', () => {
  it('should fail if no logged', async () =>
    utilsTest.throwsAsync(() => new Cloud().job(), expErrRegex.loginBefore));

  it('should fail if "id" parameter no present', async () =>
    utilsTest.throwsAsync(() => cloudFaked.job(), expErrRegex.formatStr));

  it('should fail if bad format in the "id" parameter', async () =>
    utilsTest.throwsAsync(() => cloudFaked.job(1), expErrRegex.formatStr));

  it('should return the info for a valid job', async function t() {
    if (!global.qiskit || !global.qiskit.cloud) {
      this.skip();
    }

    const res = await global.qiskit.cloud.job(global.qiskit.jobId);
    checkJob(res);
  });
});

let oldId;
describe('cloud:jobs', () => {
  it('should fail if no logged', async () =>
    utilsTest.throwsAsync(() => new Cloud().jobs(), expErrRegex.loginBefore));

  it('should fail if bad format in the "limit" option', async () =>
    utilsTest.throwsAsync(
      () => cloudFaked.jobs('a'),
      expErrRegex.formatNumber,
    ));

  it('should fail if under min. in the "limit" option', async () =>
    utilsTest.throwsAsync(() => cloudFaked.jobs(-1), expErrRegex.outRange));

  it('should fail if bad format in the "offset" option', async () =>
    utilsTest.throwsAsync(
      () => cloudFaked.jobs(1, 'a'),
      expErrRegex.formatNumber,
    ));

  it('should fail if under min. in the "offset" option', async () =>
    utilsTest.throwsAsync(() => cloudFaked.jobs(1, -1), expErrRegex.outRange));

  it('should return all jobs info without parameters', async function t() {
    if (!global.qiskit || !global.qiskit.cloud) {
      this.skip();
    }

    const res = await global.qiskit.cloud.jobs();
    assert.ok(res.length > 1);
    checkJob(res[0]);
  });

  it('should return selected number of jobs info with "limit" parameter', async function t() {
    if (!global.qiskit || !global.qiskit.cloud) {
      this.skip();
    }

    const res = await global.qiskit.cloud.jobs(1);

    assert.equal(res.length, 1);
    checkJob(res[0]);
    oldId = res[0].id;
  });

  it('should skip selected number of jobs info with "offset" parameter', async function t() {
    if (!global.qiskit || !global.qiskit.cloud) {
      this.skip();
    }

    const res = await global.qiskit.cloud.jobs(1, 1);

    assert.equal(res.length, 1);
    checkJob(res[0]);
    assert.notEqual(res[0].id, oldId);
  });
});
