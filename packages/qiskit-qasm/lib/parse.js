/*
  Copyright IBM Corp. 2017. All Rights Reserved.

  This code may only be used under the Apache 2.0 license found at
  http://www.apache.org/licenses/LICENSE-2.0.txt.

  Authors:
  - Jesús Pérez <jesusper@us.ibm.com>
  - Jorge Carballo <carballo@us.ibm.com>
*/

'use strict';

// const util = require('util');
const path = require('path');
const fs = require('fs');

const jison = require('jison');

// const QasmError = require('./QasmError');


// TODO: Do async?
const bnf = fs.readFileSync(path.resolve(__dirname, './grammar.jison'), 'utf8');
const parser = new jison.Parser(bnf);

// TODO: Parse all core libraries (when we have more)
const qelib1 = fs.readFileSync(path.resolve(__dirname, '../core/qelib1.inc'), 'utf8');
const qelibParsed = parser.parse(qelib1);


module.exports = (circuit) => {
  if (!circuit) { throw new Error('Required param: circuit'); }

  let res;

  try {
    res = parser.parse(circuit, qelibParsed);
  } catch (err) {
    // TODO: Use our custom error
    // throw new QasmError('')
    throw err;
  }

  return res;
};
