/*
  Copyright IBM Corp. 2017. All Rights Reserved.

  This code may only be used under the Apache 2.0 license found at
  http://www.apache.org/licenses/LICENSE-2.0.txt.

  Authors:
  - Jesús Pérez <jesusper@us.ibm.com>
*/

'use strict';

const assert = require('assert');

const Cloud = require('../..');
const pkgInfo = require('../../package');

const { version } = pkgInfo;
let cloud;

describe('cloud:new', () => {
  it('should work without options', () =>
    assert.equal(new Cloud().version, version));

  it('should work with empty options', () => {
    cloud = new Cloud({});
    assert.ok(true);
  });
});

describe('cloud:version', () =>
  it('should return the package version', () =>
    assert.equal(cloud.version, pkgInfo.version)));
