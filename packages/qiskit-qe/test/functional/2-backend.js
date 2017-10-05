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


// Token not needed.

const qeNoToken = new Qe();

describe('qe:calibration', () => {
  it('should fail if bad format in the "name" parameter', async () =>
    utilsTest.throwsAsync(() => qeNoToken.calibration(1), expErrRegex.formatStr));

  it('should return the calibration info for the' +
     'default backend if no parameter', async () => {
    const res = await qeNoToken.calibration();

    assert.deepEqual(Object.keys(res), ['lastUpdateDate', 'qubits', 'multiQubitGates']);
    assert.equal(typeof res.lastUpdateDate, 'string');
    assert.equal(typeof res.qubits, 'object');
    assert.equal(typeof res.multiQubitGates, 'object');
  });

  // We use a non existent one because we can´t know in advance the returned values here.
  // TODO: The API should return an error in this case.
  it('should return the calibration info for the selected backend', async () =>
    assert.deepEqual(Object.keys(await qeNoToken.calibration('nonexistent')), []));
});


describe('qe:parameters', () => {
  it('should fail if bad format in the "name" parameter', async () =>
    utilsTest.throwsAsync(() => qeNoToken.parameters(1), expErrRegex.formatStr));

  it('should return the parameters info for the' +
     'default backend if no parameter', async () => {
    const res = await qeNoToken.parameters();

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
    assert.deepEqual(Object.keys(await qeNoToken.parameters('nonexistent')), []));
});


describe('qe:queues', () => {
  it('should fail if bad format in the "name" parameter', async () =>
    utilsTest.throwsAsync(() => qeNoToken.queues(1), expErrRegex.formatStr));

  it('should return the status of the queue the default backend if no parameter', async () => {
    const res = await qeNoToken.queues();

    assert.deepEqual(Object.keys(res), ['state', 'busy', 'lengthQueue']);
    assert.equal(typeof res.state, 'boolean');
    assert.equal(typeof res.busy, 'boolean');
    assert.equal(typeof res.lengthQueue, 'number');
  });

  // We use a non existent one because we can´t know in advance the returned values here.
  // TODO: The API should return an error in this case.
  it('should return the queue info for the selected backend', async () =>
    assert.deepEqual(await qeNoToken.queues('nonexistent'), {}));
});


// Token needed.

// Already logged instance.
const { qe } = global.qiskitTest;


describe('qe:backend', () => {
  it('should fail if no logged', async () =>
    utilsTest.throwsAsync(() => qeNoToken.backend(), expErrRegex.loginBefore));

  it('should fail if bad format in the "name" parameter', async () =>
    utilsTest.throwsAsync(() => qe.backend(1), expErrRegex.formatStr));

  it('should return a backend with the default "name" parameter', async function t() {
    if (!global.qiskitTest.integration) { this.skip(); }

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
    assert.equal(res.name, 'ibmqx4');
  });

  it('should return a backend info for a valid "name" parameter', async function t() {
    if (!global.qiskitTest.integration) { this.skip(); }

    const name = 'ibmqx5';
    const res = await qe.backend(name);

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
    assert.equal(res.name, name);
  });

  // We use a non existent one because we can´t know in advance the returned values here.
  // TODO: The API should return an error in this case.
  it('should return the queue info for the selected backend', async function t() {
    if (!global.qiskitTest.integration) { this.skip(); }

    assert.deepEqual(await qe.backend('nonexistent'), {});
  });
});


describe('qe:backends', () => {
  it('should fail if no logged', async () =>
    utilsTest.throwsAsync(() => qeNoToken.backends(), expErrRegex.loginBefore));

  it('should return the online backends info', async function t() {
    if (!global.qiskitTest.integration) { this.skip(); }

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

  it('should fail if bad format in the "onlySims" parameter', async () =>
    utilsTest.throwsAsync(() => qe.backends(1), expErrRegex.formatBool));

  it('should allow to ask only for simulators info', async function t() {
    if (!global.qiskitTest.integration) { this.skip(); }

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
