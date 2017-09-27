/*
  Copyright IBM Corp. 2017. All Rights Reserved.

  This code may only be used under the Apache 2.0 license found at
  http://www.apache.org/licenses/LICENSE-2.0.txt.

  Authors:
  - Jesús Pérez <jesusper@us.ibm.com>
*/

'use strict';


const assert = require('assert');
const utils = require('qiskit-utils');

const Qe = require('..');
const pkgInfo = require('../package');


const expErrRegex = {
  formatUri: /URI format expected/,
  formatStr: /String format expected/,
  formatBool: /Boolean format expected/,
  loginBefore: /Please use "login" before/,
};
let tokenPersonal;
const opts = {};
const { version } = pkgInfo;

// To support the integration environment (Travis) without exposing sensitive data.
// TODO:
// - Use spies to check all request are ok for develop environment.
if (process.env.QE_TOKEN) { tokenPersonal = process.env.QE_TOKEN; }
if (process.env.QE_URI) { opts.uri = process.env.QE_URI; }

let qe;


describe('qe:new', () => {
  it('should work without options', () => {
    const qe2 = new Qe();
    assert.equal(qe2.version, version);
  });

  it('should work with empty options', () => {
    const qe2 = new Qe({});
    assert.equal(qe2.version, version);
  });

  it('should work with options', () => {
    qe = new Qe(opts);
    assert.equal(qe.version, version);
  });
});


describe('qe:version', () =>
  it('should return the package version', () => assert.equal(qe.version, pkgInfo.version)));


// No token needed.


describe('qe:calibration', () => {
  it('should fail if bad format in the "name" parameter', async () => {
    await utils.throwsAsync(() => qe.calibration(1), expErrRegex.formatStr);
  });

  it('should return the calibration info for the' +
     'default backend if no parameter', async () => {
    const res = await qe.calibration();

    assert.deepEqual(Object.keys(res), ['lastUpdateDate', 'qubits', 'multiQubitGates']);
    assert.equal(typeof res.lastUpdateDate, 'string');
    assert.equal(typeof res.qubits, 'object');
    assert.equal(typeof res.multiQubitGates, 'object');
  });

  it('should return the calibration info for the selected backend', async () => {
    // We use a non existent one because we can´t know in advance the returned values here.
    // TODO: The API should return an error in this case.
    const res = await qe.calibration('nonexistent');

    assert.deepEqual(Object.keys(res), []);
  });
});


describe('qe:parameters', () => {
  it('should fail if bad format in the "name" parameter', async () => {
    await utils.throwsAsync(() => qe.parameters(1), expErrRegex.formatStr);
  });

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

  it('should return the parameters info for the selected backend', async () => {
    // We use a non existent one because we can´t know in advance the returned values here.
    // TODO: The API should return an error in this case.
    const res = await qe.parameters('nonexistent');

    assert.deepEqual(Object.keys(res), []);
  });
});


describe('qe:queues', () => {
  it('should fail if bad format in the "name" parameter', async () => {
    await utils.throwsAsync(() => qe.queues(1), expErrRegex.formatStr);
  });

  it('should return the status of the queue the default backend if no parameter', async () => {
    const res = await qe.queues();

    assert.deepEqual(Object.keys(res), ['state', 'busy']);
    assert.equal(typeof res.state, 'boolean');
    assert.equal(typeof res.busy, 'boolean');
  });

  it('should return the queue info for the selected backend', async () => {
    // We use a non existent one because we can´t know in advance the returned values here.
    // TODO: The API should return an error in this case.
    const res = await qe.queues('nonexistent');

    assert.deepEqual(res, {});
  });
});


describe('qe:login', () => {
  // TODO: Move next 3 to each respective section when we have the logout
  // endpoint (still not available in he API).
  it('should fail if no logged (404) - backends', async () => {
    await utils.throwsAsync(() => qe.backends(), expErrRegex.loginBefore);
  });

  it('should fail if no logged (404) - lastCodes', async () => {
    await utils.throwsAsync(() => qe.lastCodes(), expErrRegex.loginBefore);
  });

  it('should fail if no logged (404) - credits', async () => {
    await utils.throwsAsync(() => qe.credits(), expErrRegex.loginBefore);
  });

  it('should fail if bad format in the "token" parameter', async () => {
    await utils.throwsAsync(() => qe.login(1), expErrRegex.formatStr);
  });

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


describe('qe:backends', () => {
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

  it('should fail if bad format in the "onlySim" parameter', async () => {
    await utils.throwsAsync(() => qe.backends(1), expErrRegex.formatBool);
  });

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
  it('should return the info of my credits in the platform', async () => {
    const res = await qe.credits();

    assert.deepEqual(Object.keys(res), ['promotional', 'remaining', 'maxUserType']);
    assert.equal(typeof res.promotional, 'number');
    assert.equal(typeof res.remaining, 'number');
    assert.equal(typeof res.maxUserType, 'number');
  });
});


describe('qe:lastCodes', () => {
  it('should return the code used in the last executions by this user', async () => {
    const res = await qe.lastCodes();

    assert.equal(typeof res, 'object');
    // TODO: We can check more because, for now we don´t have any execution or code.
  });
});


// TODO: original library tests


// def test_api_run_experiment(self):
//     '''
//     Check run an experiment by user authenticated
//     '''
//     api = IBMQuantumExperience(API_TOKEN)
//     backend = api.available_backend_simulators()[0]['name']
//     shots = 1
//     experiment = api.run_experiment(qasm, backend, shots)
//     self.assertIsNotNone(experiment['status'])

// def test_api_run_experiment_with_seed(self):
//     '''
//     Check run an experiment with seed by user authenticated
//     '''
//     api = IBMQuantumExperience(API_TOKEN)
//     backend = api.available_backend_simulators()[0]['name']
//     shots = 1
//     seed = 815
//     experiment = api.run_experiment(qasm, backend, shots, seed=seed)
//     self.assertEqual(int(experiment['result']['extraInfo']['seed']), seed)

// def test_api_run_experiment_fail_backend(self):
//     '''
//     Check run an experiment by user authenticated is not run because the
//     backend does not exist
//     '''
//     api = IBMQuantumExperience(API_TOKEN)
//     backend = '5qreal'
//     shots = 1
//     self.assertRaises(BadBackendError,
//                       api.run_experiment, qasm, backend, shots)

// def test_api_run_job(self):
//     '''
//     Check run an job by user authenticated
//     '''
//     api = IBMQuantumExperience(API_TOKEN)
//     backend = 'simulator'
//     shots = 1
//     job = api.run_job(qasms, backend, shots)
//     self.assertIsNotNone(job['status'])

// def test_api_run_job_fail_backend(self):
//     '''
//     Check run an job by user authenticated is not run because the backend
//     does not exist
//     '''
//     api = IBMQuantumExperience(API_TOKEN)
//     backend = 'real5'
//     shots = 1
//     self.assertRaises(BadBackendError, api.run_job, qasms, backend, shots)

// def test_api_get_jobs(self):
//     '''
//     Check get jobs by user authenticated
//     '''
//     api = IBMQuantumExperience(API_TOKEN)
//     jobs = api.get_jobs(2)
//     self.assertEqual(len(jobs), 2)
