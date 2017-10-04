/*
  Copyright IBM Corp. 2017. All Rights Reserved.

  This code may only be used under the Apache 2.0 license found at
  http://www.apache.org/licenses/LICENSE-2.0.txt.

  Authors:
  - Jesús Pérez <jesusper@us.ibm.com>
*/

'use strict';


const assert = require('assert');

const parser = require('../../lib/parser');
const expErrRegex = require('../errorRe');


describe('parser:number', () => {
  it('should fail without parameter', () => assert.throws(
    () => { parser.number(); },
    expErrRegex.formatNumber,
  ));

  it('should fail with bad format in the parameter', () => assert.throws(
    () => { parser.number(true); },
    expErrRegex.formatNumber,
  ));

  it('should return the result with a good parameter', () =>
    assert.equal(parser.number(1), 1));
});


describe('parser:string', () => {
  it('should fail without parameter', () => assert.throws(
    () => { parser.string(); },
    expErrRegex.formatStr,
  ));

  it('should fail with bad format in the parameter', () => assert.throws(
    () => { parser.string(1); },
    expErrRegex.formatStr,
  ));

  it('should return the result with a good parameter', () =>
    assert.equal(parser.string('a'), 'a'));
});


describe('parser:bool', () => {
  it('should fail without parameter', () => assert.throws(
    () => { parser.bool(); },
    expErrRegex.formatBool,
  ));

  it('should fail with bad format in the parameter', () => assert.throws(
    () => { parser.bool('a'); },
    expErrRegex.formatBool,
  ));

  it('should return the result with a good parameter', () =>
    assert.ok(parser.bool(true)));
});
