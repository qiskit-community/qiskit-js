/*
  Copyright IBM Corp. 2017. All Rights Reserved.

  This code may only be used under the Apache 2.0 license found at
  http://www.apache.org/licenses/LICENSE-2.0.txt.

  Authors:
  - Jesús Pérez <jesusper@us.ibm.com>
*/

'use strict';

const assert = require('assert');

const utils = require('..');
const { version } = require('../package');


function multiIncludes(text, values) {
  return values.every(val => text.includes(val));
}


describe('utils:api', () => {
  it('should include all documented items', () => {
    assert.ok(multiIncludes(Object.keys(utils), [
      'version',
      'debug',
      'pathToTag',
    ]));
  });

  it('should return the the correct result for its methods', () =>
    assert.equal(utils.version, version));
});
