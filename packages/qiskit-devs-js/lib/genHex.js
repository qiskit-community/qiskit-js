/**
 * @license
 *
 * Copyright (c) 2017, IBM.
 *
 * This source code is licensed under the Apache License, Version 2.0 found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const qubits = require('jsqubits').jsqubits;

const utils = require('./utils');

const dbg = utils.dbg(__filename);

module.exports = (len = 16) => {
  let strHex = '';

  // We make it in steps (char by char) to avoid a huge CPU load. It's not
  // the best strategy for a cloud engine but this is a local one.
  utils.times(len, () => {
    // 1 char : 4 bits
    const binChar = qubits('|0000>')
      .hadamard(qubits.ALL)
      .measure(qubits.ALL)
      .asBitString();

    strHex += utils.ayb.parseInt(binChar, 2, 16);
  });

  dbg('Random string (hex):', { strHex });
  return strHex;
};
