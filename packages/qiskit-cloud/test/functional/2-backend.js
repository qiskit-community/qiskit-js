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
const utilsTest = require('../../../../utils-test');

const Qe = require('../..');
const expErrRegex = require('../errorRe');

// Token not needed.

const cloudNoToken = new Qe();

describe('cloud:calibration', () => {
  it('should fail if bad format in the "name" parameter', async () =>
    utilsTest.throwsAsync(
      () => cloudNoToken.calibration(1),
      expErrRegex.formatStr,
    ));

  it(
    'should return the calibration info for the' +
      'default backend if no parameter',
    async () => {
      const res = await cloudNoToken.calibration();

      assert.deepEqual(Object.keys(res), [
        'lastUpdateDate',
        'qubits',
        'multiQubitGates',
      ]);
      assert.equal(typeof res.lastUpdateDate, 'string');
      assert.equal(typeof res.qubits, 'object');
      assert.equal(typeof res.multiQubitGates, 'object');
    },
  );

  // We use a non existent one because we can´t know in advance the returned values here.
  // TODO: The API should return an error in this case.
  it('should return the calibration info for the selected backend', async () =>
    assert.deepEqual(
      Object.keys(await cloudNoToken.calibration('nonexistent')),
      [],
    ));
});

describe('cloud:parameters', () => {
  it('should fail if bad format in the "name" parameter', async () =>
    utilsTest.throwsAsync(
      () => cloudNoToken.parameters(1),
      expErrRegex.formatStr,
    ));

  it(
    'should return the parameters info for the' +
      'default backend if no parameter',
    async () => {
      const res = await cloudNoToken.parameters();

      assert.deepEqual(Object.keys(res), [
        'lastUpdateDate',
        'fridgeParameters',
        'qubits',
      ]);
      assert.equal(typeof res.lastUpdateDate, 'string');
      assert.equal(typeof res.fridgeParameters, 'object');
      assert.equal(typeof res.qubits, 'object');
    },
  );

  // We use a non existent one because we can´t know in advance the returned values here.
  // TODO: The API should return an error in this case.
  it('should return the parameters info for the selected backend', async () =>
    assert.deepEqual(
      Object.keys(await cloudNoToken.parameters('nonexistent')),
      [],
    ));
});

describe('cloud:queues', () => {
  it('should fail if bad format in the "name" parameter', async () =>
    utilsTest.throwsAsync(() => cloudNoToken.queues(1), expErrRegex.formatStr));

  it('should return the status of the queue the default backend if no parameter', async () => {
    const res = await cloudNoToken.queues();

    assert.deepEqual(Object.keys(res), ['state', 'status', 'lengthQueue']);
    assert.equal(typeof res.state, 'boolean');
    assert.equal(typeof res.status, 'string');
    assert.equal(typeof res.lengthQueue, 'number');
  });

  // We use a non existent one because we can´t know in advance the returned values here.
  // TODO: The API should return an error in this case.
  it('should return the queue info for the selected backend', async () =>
    assert.deepEqual(await cloudNoToken.queues('nonexistent'), {}));
});

// Token needed.

// Already logged instance.
const { cloud } = global.qiskitTest;

describe('cloud:backend', () => {
  it('should fail if no logged', async () =>
    utilsTest.throwsAsync(
      () => cloudNoToken.backend(),
      expErrRegex.loginBefore,
    ));

  it('should fail if bad format in the "name" parameter', async () =>
    utilsTest.throwsAsync(() => cloud.backend(1), expErrRegex.formatStr));

  it('should return a backend with the default "name" parameter', async function t() {
    if (!global.qiskitTest.integration) {
      this.skip();
    }

    const res = await cloud.backend();

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
    if (!global.qiskitTest.integration) {
      this.skip();
    }

    const name = 'ibmqx5';
    const res = await cloud.backend(name);

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
    if (!global.qiskitTest.integration) {
      this.skip();
    }

    assert.deepEqual(await cloud.backend('nonexistent'), {});
  });
});

describe('cloud:backends', () => {
  it('should fail if no logged', async () =>
    utilsTest.throwsAsync(
      () => cloudNoToken.backends(),
      expErrRegex.loginBefore,
    ));

  it('should return the online backends info', async function t() {
    if (!global.qiskitTest.integration) {
      this.skip();
    }

    const res = await cloud.backends();

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
    utilsTest.throwsAsync(() => cloud.backends(1), expErrRegex.formatBool));

  it('should allow to ask only for simulators info', async function t() {
    if (!global.qiskitTest.integration) {
      this.skip();
    }

    const res = await cloud.backends(true);

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
