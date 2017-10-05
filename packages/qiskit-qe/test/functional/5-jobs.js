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


function checkJob(res) {
  assert.deepEqual(Object.keys(res), [
    'id', 'backend', 'shots', 'creationDate',
    'usedCredits', 'status', 'circuits',
  ]);
  assert.equal(typeof res.id, 'string');
  assert.equal(typeof res.backend, 'string');
  assert.equal(typeof res.shots, 'number');
  assert.equal(typeof res.creationDate, 'string');
  assert.equal(typeof res.usedCredits, 'number');
  assert.equal(typeof res.status, 'string');
  assert.equal(res.circuits.length, 1);
  assert.deepEqual(Object.keys(res.circuits[0]), ['qasm', 'execution']);
  assert.equal(typeof res.circuits[0].qasm, 'string');
  assert.deepEqual(Object.keys(res.circuits[0].execution), ['id', 'status']);
  assert.equal(typeof res.circuits[0].execution.id, 'string');
  assert.equal(typeof res.circuits[0].execution.status, 'string');
  // Maybe it has not finished.
  if (res.circuits[0].execution.result) {
    assert.deepEqual(Object.keys(res.circuits[0].execution.result), ['date', 'data']);
    assert.equal(typeof res.circuits[0].execution.result.date, 'string');
    assert.deepEqual(Object.keys(res.circuits[0].execution.result.data), ['time', 'count']);
    assert.equal(typeof res.circuits[0].execution.result.data.time, 'string');
    assert.equal(typeof res.circuits[0].execution.result.data.count, 'object');
  }
}


describe('qe:job', () => {
  it('should fail if no logged', async () =>
    utilsTest.throwsAsync(() => new Qe().job(), expErrRegex.loginBefore));

  it('should fail if "id" parameter no present', async () =>
    utilsTest.throwsAsync(() => qe.job(), expErrRegex.formatStr));

  it('should fail if bad format in the "id" parameter', async () =>
    utilsTest.throwsAsync(() => qe.job(1), expErrRegex.formatStr));

  it('should return the info for a valid job', async function t() {
    if (!global.qiskitTest.integration) { this.skip(); }

    const res = await qe.job(global.qiskitTest.jobId);
    checkJob(res);
  });
});


let oldId;
describe('qe:jobs', () => {
  it('should fail if no logged', async () =>
    utilsTest.throwsAsync(() => new Qe().jobs(), expErrRegex.loginBefore));

  it('should fail if bad format in the "limit" option', async () =>
    utilsTest.throwsAsync(() => qe.jobs('a'), expErrRegex.formatNumber));

  it('should fail if under min. in the "limit" option', async () =>
    utilsTest.throwsAsync(() => qe.jobs(-1), expErrRegex.outRange));

  it('should fail if bad format in the "offset" option', async () =>
    utilsTest.throwsAsync(() => qe.jobs(1, 'a'), expErrRegex.formatNumber));

  it('should fail if under min. in the "offset" option', async () =>
    utilsTest.throwsAsync(() => qe.jobs(1, -1), expErrRegex.outRange));

  it('should return all jobs info without parameters', async function t() {
    if (!global.qiskitTest.integration) { this.skip(); }

    const res = await qe.jobs();

    assert.ok(res.length > 1);
    checkJob(res[0]);
  });

  it('should return selected number of jobs info with "limit" parameter', async function t() {
    if (!global.qiskitTest.integration) { this.skip(); }

    const res = await qe.jobs(1);

    assert.equal(res.length, 1);
    checkJob(res[0]);
    oldId = res[0].id;
  });

  it('should skip selected number of jobs info with "offset" parameter', async function t() {
    if (!global.qiskitTest.integration) { this.skip(); }

    const res = await qe.jobs(1, 1);

    assert.equal(res.length, 1);
    checkJob(res[0]);
    assert.notEqual(res[0].id, oldId);
  });
});
