/*
  Copyright IBM Corp. 2017. All Rights Reserved.

  This code may only be used under the Apache 2.0 license found at
  http://www.apache.org/licenses/LICENSE-2.0.txt.

  Authors:
  - Jesús Pérez <jesusper@us.ibm.com>
*/

'use strict';

const assert = require('assert');
const utilsTest = require('../../../utils-test');

const Qe = require('..');
const pkgInfo = require('../package');
const expErrRegex = require('./errorRe');


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

let tokenPersonal;
const { version } = pkgInfo;
let qe;
// To support the integration environment (Travis) without exposing sensitive data.
// TODO:
// - Use spies to check all request are ok for develop environment.
if (process.env.QE_TOKEN) { tokenPersonal = process.env.QE_TOKEN; }


describe('qe:new', () => {
  it('should work without options', () =>
    assert.equal(new Qe().version, version));

  it('should work with empty options', () => {
    qe = new Qe({});

    assert.equal(qe.version, version);
  });
});


describe('qe:version', () =>
  it('should return the package version', () =>
    assert.equal(qe.version, pkgInfo.version)));


// No token needed.


describe('qe:calibration', () => {
  it('should fail if bad format in the "name" parameter', async () =>
    utilsTest.throwsAsync(() => qe.calibration(1), expErrRegex.formatStr));

  it('should return the calibration info for the' +
     'default backend if no parameter', async () => {
    const res = await qe.calibration();

    assert.deepEqual(Object.keys(res), ['lastUpdateDate', 'qubits', 'multiQubitGates']);
    assert.equal(typeof res.lastUpdateDate, 'string');
    assert.equal(typeof res.qubits, 'object');
    assert.equal(typeof res.multiQubitGates, 'object');
  });

  // We use a non existent one because we can´t know in advance the returned values here.
  // TODO: The API should return an error in this case.
  it('should return the calibration info for the selected backend', async () =>
    assert.deepEqual(Object.keys(await qe.calibration('nonexistent')), []));
});


describe('qe:parameters', () => {
  it('should fail if bad format in the "name" parameter', async () =>
    utilsTest.throwsAsync(() => qe.parameters(1), expErrRegex.formatStr));

  it('should return the parameters info for the' +
     'default backend if no parameter', async () => {
    const res = await qe.parameters();

    assert.deepEqual(Object.keys(res), [
      'lastUpdateDate',
      'fridgeParameters',
      'qubits',
    ]);
    assert.equal(typeof res.lastUpdateDate, 'string');
    assert.equal(typeof res.fridgeParameters, 'object');
    assert.equal(typeof res.qubits, 'object');
  });

  // We use a non existent one because we can´t know in advance the returned values here.
  // TODO: The API should return an error in this case.
  it('should return the parameters info for the selected backend', async () =>
    assert.deepEqual(Object.keys(await qe.parameters('nonexistent')), []));
});


describe('qe:queues', () => {
  it('should fail if bad format in the "name" parameter', async () =>
    utilsTest.throwsAsync(() => qe.queues(1), expErrRegex.formatStr));

  it('should return the status of the queue the default backend if no parameter', async () => {
    const res = await qe.queues();

    assert.deepEqual(Object.keys(res), ['state', 'busy', 'lengthQueue']);
    assert.equal(typeof res.state, 'boolean');
    assert.equal(typeof res.busy, 'boolean');
    assert.equal(typeof res.lengthQueue, 'number');
  });

  // We use a non existent one because we can´t know in advance the returned values here.
  // TODO: The API should return an error in this case.
  it('should return the queue info for the selected backend', async () =>
    assert.deepEqual(await qe.queues('nonexistent'), {}));
});


describe('qe:login', () => {
  it('should fail if "token" parameter no present', async () =>
    // TODO: Emit proper error.
    utilsTest.throwsAsync(() => qe.login(), expErrRegex.formatStr));

  it('should fail if bad format in the "token" parameter', async () =>
    utilsTest.throwsAsync(() => qe.login(1), expErrRegex.formatStr));

  it('should return the user info with a valid login', async () => {
    const res = await qe.login(tokenPersonal);

    assert.deepEqual(Object.keys(res), ['ttl', 'created', 'userId', 'token']);
    assert.equal(typeof res.ttl, 'number');
    assert.ok(typeof res.created === 'string');
    assert.ok(typeof res.userId === 'string');
    assert.ok(typeof res.token === 'string');
  });

  it('should set the token properly', async () => {
    assert.equal(typeof qe.token, 'string');
    assert.notEqual(qe.token.length, 0);
  });
});


// Token needed.

describe('qe:backend', () => {
  it('should fail if no logged', async () =>
    utilsTest.throwsAsync(() => new Qe().backend(), expErrRegex.loginBefore));

  it('should return a backends info', async () => {
    const res = await qe.backend();

    assert.deepEqual(Object.keys(res), [
      'name',
      'version',
      'status',
      'serialNumber',
      'description',
      'onlineDate',
      'chipName',
      'id',
      'topologyId',
      'url',
      'basisGates',
      'simulator',
      'nQubits',
      'couplingMap',
    ]);
  });

  // We use a non existent one because we can´t know in advance the returned values here.
  // TODO: The API should return an error in this case.
  it('should return the queue info for the selected backend', async () =>
    assert.deepEqual(await qe.backend('nonexistent'), {}));
});


describe('qe:backends', () => {
  it('should fail if no logged', async () =>
    utilsTest.throwsAsync(() => new Qe().backends(), expErrRegex.loginBefore));

  it('should return the online backends info', async () => {
    const res = await qe.backends();

    assert.equal(res.length, 4);
    assert.deepEqual(Object.keys(res[0]), [
      'name',
      'version',
      'status',
      'serialNumber',
      'description',
      'onlineDate',
      'chipName',
      'id',
      'topologyId',
      'url',
      'basisGates',
      'simulator',
      'nQubits',
      'couplingMap',
    ]);
  });

  it('should fail if bad format in the "onlySim" parameter', async () =>
    utilsTest.throwsAsync(() => qe.backends(1), expErrRegex.formatBool));

  it('should allow to ask only for simulators info', async () => {
    const res = await qe.backends(true);

    assert.equal(res.length, 1);
    assert.equal(Object.keys(res[0]).length, 9);
    assert.equal(res[0].name, 'ibmqx_qasm_simulator');
    assert.equal(res[0].status, 'on');
    assert.equal(res[0].serialNumber, 'ibmqx_qasm_simulator');
    assert.equal(res[0].description, 'online qasm simulator');
    assert.equal(res[0].id, '4575265c19372392522a392842adc0e3');
    assert.equal(res[0].gateSet, 'u1,u2,u3,cx');
    assert.equal(res[0].topologyId, '250e969c6b9e68aa2a045ffbceb3ac33');
    assert.equal(res[0].simulator, true);
    assert.equal(res[0].nQubits, 24);
  });
});


describe('qe:credits', () => {
  it('should fail if no logged', async () =>
    utilsTest.throwsAsync(() => new Qe().credits(), expErrRegex.loginBefore));

  it('should return the info of my credits in the platform', async () => {
    const res = await qe.credits();

    assert.deepEqual(Object.keys(res), ['promotional', 'remaining', 'maxUserType']);
    assert.equal(typeof res.promotional, 'number');
    assert.equal(typeof res.remaining, 'number');
    assert.equal(typeof res.maxUserType, 'number');
  });
});


const circuit = 'OPENQASM 2.0;' +
'include "qelib1.inc";' +
'qreg q[1];' +
'creg c[1];' +
'measure q -> c;';
// To use in the Job endpoint related tests.
let jobId;

describe('qe:run', () => {
  it('should fail if no logged', async () =>
    utilsTest.throwsAsync(() => new Qe().run('a'), expErrRegex.loginBefore));

  it('should fail if "circuit" parameter no present', async () =>
    // TODO: Emit proper error.
    utilsTest.throwsAsync(() => qe.run(), expErrRegex.formatStr));

  it('should fail if bad format in the "circuit" parameter', async () =>
    utilsTest.throwsAsync(() => qe.run(1), expErrRegex.formatStr));

  it('should fail if bad format in the "backend" option', async () =>
    utilsTest.throwsAsync(() => qe.run('a', { backend: 1 }), expErrRegex.formatStr));

  it('should fail if bad format in the "name" option', async () =>
    utilsTest.throwsAsync(() => qe.run('a', { name: 1 }), expErrRegex.formatStr));

  it('should fail if bad format in the "shots" option', async () =>
    utilsTest.throwsAsync(() => qe.run('a', { shots: 'a' }), expErrRegex.formatNumber));

  it('should fail if under min. in the "shots" option', async () =>
    utilsTest.throwsAsync(() => qe.run('a', { shots: -1 }), expErrRegex.outRange));

  it('should fail if over max. in the "shots" option', async () =>
    utilsTest.throwsAsync(() => qe.run('a', { shots: 8193 }), expErrRegex.outRange));

  it('should fail if bad format in the "seed" option', async () =>
    utilsTest.throwsAsync(() => qe.run('a', { seed: 1 }), expErrRegex.formatStr));

  it('should fail if bad format in the "maxCredits" option', async () =>
    utilsTest.throwsAsync(() => qe.run('a', { maxCredits: 'a' }), expErrRegex.formatNumber));

  it('should fail if under min. in the "maxCredits" option', async () =>
    utilsTest.throwsAsync(() => qe.run('a', { maxCredits: -1 }), expErrRegex.outRange));

  it('should fail if a controlled API error', async () =>
    utilsTest.throwsAsync(() => qe.run('a'), expErrRegex.badQasm));

  it('should return the run info for a valid circuit', async () => {
    const res = await qe.run(circuit);
    jobId = res.id;

    assert.deepEqual(Object.keys(res), ['id', 'status', 'name']);
    assert.equal(typeof res.id, 'string');
    assert.equal(typeof res.status, 'string');
  });
});


describe('qe:runBatch', () => {
  it('should fail if no logged', async () =>
    utilsTest.throwsAsync(() => new Qe().runBatch('a'), expErrRegex.loginBefore));

  it('should fail if "circuits" parameter no present', async () =>
    // TODO: Emit proper error.
    utilsTest.throwsAsync(() => qe.runBatch(), expErrRegex.formatArr));

  it('should fail if bad format in the "circuits" parameter', async () =>
    utilsTest.throwsAsync(() => qe.runBatch(1), expErrRegex.formatArr));

  it('should fail if empty "circuits" parameter', async () =>
    utilsTest.throwsAsync(() => qe.runBatch([]), expErrRegex.formatArr));

  it('should fail if bad format on the elements of "circuits"', async () =>
    utilsTest.throwsAsync(() => qe.runBatch([1]), expErrRegex.formatObj));

  it('should fail if "qasm" subfield not present', async () =>
    utilsTest.throwsAsync(() => qe.runBatch([{}]), expErrRegex.formatStr));

  it('should fail if bad format in the "qasm" subfield', async () =>
    utilsTest.throwsAsync(() => qe.runBatch([{ qasm: 1 }]), expErrRegex.formatStr));

  it('should fail if bad format in the "shots" subfield', async () =>
    utilsTest.throwsAsync(() =>
      qe.runBatch([{ qasm: 'a', shots: 'a' }]), expErrRegex.formatNumber));

  it('should fail if under min. in the "shots" subfield', async () =>
    utilsTest.throwsAsync(() =>
      qe.runBatch([{ qasm: 'a', shots: -1 }]), expErrRegex.outRange));

  it('should fail if over max. in the "shots" subfield', async () =>
    utilsTest.throwsAsync(() =>
      qe.runBatch([{ qasm: 'a', shots: 8193 }]), expErrRegex.outRange));

  it('should fail if bad format in the "seed" subfield', async () =>
    utilsTest.throwsAsync(() =>
      qe.runBatch([{ qasm: 'a', seed: 1 }]), expErrRegex.formatStr));

  it('should fail if bad format in the "name" subfield', async () =>
    utilsTest.throwsAsync(() =>
      qe.runBatch([{ qasm: 'a', name: 1 }]), expErrRegex.formatStr));

  it('should fail if bad format in the "backend" option', async () =>
    utilsTest.throwsAsync(() =>
      qe.runBatch(([{ qasm: 'a' }], { backend: 1 }), expErrRegex.formatStr)));

  it('should fail if bad format in the "name" option', async () =>
    utilsTest.throwsAsync(() =>
      qe.runBatch(([{ qasm: 'a' }], { name: 1 }), expErrRegex.formatStr)));

  it('should fail if bad format in the "shots" option', async () =>
    utilsTest.throwsAsync(() =>
      qe.runBatch(([{ qasm: 'a' }], { shots: 'a' }), expErrRegex.formatNumber)));

  it('should fail if under min. in the "shots" option', async () =>
    utilsTest.throwsAsync(() =>
      qe.runBatch(([{ qasm: 'a' }], { shots: -1 }), expErrRegex.outRange)));

  it('should fail if over max. in the "shots" option', async () =>
    utilsTest.throwsAsync(() =>
      qe.runBatch(([{ qasm: 'a' }], { shots: 8193 }), expErrRegex.outRange)));

  it('should fail if bad format in the "seed" option', async () =>
    utilsTest.throwsAsync(() =>
      qe.runBatch(([{ qasm: 'a' }], { seed: 1 }), expErrRegex.formatStr)));

  it('should fail if bad format in the "maxCredits" option', async () =>
    utilsTest.throwsAsync(() =>
      qe.runBatch(([{ qasm: 'a' }], { maxCredits: 'a' }), expErrRegex.formatNumber)));

  it('should fail if under min. in the "maxCredits" option', async () =>
    utilsTest.throwsAsync(() =>
      qe.runBatch(([{ qasm: 'a' }], { maxCredits: -1 }), expErrRegex.formatStr)));

  it('should fail if a controlled API error', async () =>
    utilsTest.throwsAsync(() =>
      qe.runBatch(([{ qasm: 'a' }]), expErrRegex.badQasm)));

  it('should return the run info for a valid batch of circuits', async () => {
    const res = await qe.runBatch([{ qasm: circuit }]);

    assert.deepEqual(Object.keys(res), ['id', 'status']);
    assert.equal(typeof res.id, 'string');
    assert.equal(res.status, 'RUNNING');
  });
});


describe('qe:job', () => {
  it('should fail if no logged', async () =>
    utilsTest.throwsAsync(() => new Qe().job(), expErrRegex.loginBefore));

  it('should fail if "id" parameter no present', async () =>
    utilsTest.throwsAsync(() => qe.job(), expErrRegex.formatStr));

  it('should fail if bad format in the "id" parameter', async () =>
    utilsTest.throwsAsync(() => qe.job(1), expErrRegex.formatStr));

  it('should return the info for a valid job', async () => {
    const res = await qe.job(jobId);

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

  it('should return all jobs info without parameters', async () => {
    const res = await qe.jobs();

    assert.ok(res.length > 1);
    checkJob(res[0]);
  });

  it('should return selected number of jobs info with "limit" parameter', async () => {
    const res = await qe.jobs(1);

    assert.equal(res.length, 1);
    checkJob(res[0]);
    oldId = res[0].id;
  });

  it('should skip selected number of jobs info with "offset" parameter', async () => {
    const res = await qe.jobs(1, 1);

    assert.equal(res.length, 1);
    checkJob(res[0]);
    assert.notEqual(res[0].id, oldId);
  });
});
