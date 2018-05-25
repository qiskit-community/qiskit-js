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
