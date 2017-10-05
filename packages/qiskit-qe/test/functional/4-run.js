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
const circuit = 'OPENQASM 2.0;' +
                'include "qelib1.inc";' +
                'qreg q[1];' +
                'creg c[1];' +
                'measure q -> c;';


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

  it('should fail if a controlled API error', async function t() {
    if (!global.qiskitTest.integration) { this.skip(); }

    utilsTest.throwsAsync(() => qe.run('a'), expErrRegex.badQasm);
  });

  it('should return the run info for a valid circuit', async function t() {
    if (!global.qiskitTest.integration) { this.skip(); }

    const res = await qe.run(circuit);

    // To use in the Job endpoint related tests.
    global.qiskitTest.jobId = res.id;

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

  it('should fail if a controlled API error', async function t() {
    if (!global.qiskitTest.integration) { this.skip(); }

    utilsTest.throwsAsync(() =>
      qe.runBatch(([{ qasm: 'a' }]), expErrRegex.badQasm));
  });

  it('should return the run info for a valid batch of circuits', async function t() {
    if (!global.qiskitTest.integration) { this.skip(); }

    const res = await qe.runBatch([{ qasm: circuit }]);

    assert.deepEqual(Object.keys(res), ['id', 'status']);
    assert.equal(typeof res.id, 'string');
    assert.equal(res.status, 'RUNNING');
  });
});
