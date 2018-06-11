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

const Cloud = require('../..');
const expErrRegex = require('../errorRe');

const cloud = new Cloud();
global.qiskitTest = {
  // To reuse in the rest of test files of this folder and avoid multiple re-login.
  cloud,
  // To detect if we want to run integration tests without exposing sensitive data.
  integration: false,
};

describe('cloud:login', () => {
  it('should fail if "token" parameter no present', async () =>
    // TODO: Emit proper error.
    utilsTest.throwsAsync(() => cloud.login(), expErrRegex.formatStr));

  it('should fail if bad format in the "token" parameter', async () =>
    utilsTest.throwsAsync(() => cloud.login(1), expErrRegex.formatStr));

  // TODO: Mocha automagically added stuff to this.* not supported with arrow functions.
  // https://github.com/mochajs/mocha/issues/1856
  // it('should return the user info with a valid login', async () => {
  it('should return the user info with a valid login', async function t() {
    if (!process.env.QE_TOKEN) {
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

    global.qiskitTest.integration = true;

    const res = await cloud.login(process.env.QE_TOKEN);

    assert.deepEqual(Object.keys(res), ['ttl', 'created', 'userId', 'token']);
    assert.equal(typeof res.ttl, 'number');
    assert.ok(typeof res.created === 'string');
    assert.ok(typeof res.userId === 'string');
    assert.ok(typeof res.token === 'string');
  });

  it('should set the token properly', async () => {
    assert.equal(typeof cloud.token, 'string');
    assert.notEqual(cloud.token.length, 0);
  });
});
