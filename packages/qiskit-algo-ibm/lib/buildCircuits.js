/**
 * @license
 *
 * Copyright (c) 2017, IBM.
 *
 * This source code is licensed under the Apache License, Version 2.0 found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const utils = require('./utils');
const buildCircuit = require('./buildCircuit');

const dbg = utils.debug(__filename);

module.exports = (len = 16, backendQubits = 4) => {
  // TODO: Add types/values checking.

  // 1 hex char : 4 bits
  const neededQubits = len * 4;
  const circuits = [];

  // ie:
  // - len = 4 -> neededQubits = 16
  // - backendQubits = 16
  // ------------------------------
  // - len = 3 -> neededQubits = 4
  // - backendQubits = 16
  if (neededQubits <= backendQubits) {
    return [buildCircuit(neededQubits)];
  }

  const circuit = buildCircuit(backendQubits);
  // ie:
  // - len = 8 -> neededQubits = 32
  // - backendQubits = 4
  // - blocksNumber = 32 / 4 = 7
  // - blocksNumberExtra = 32 % 4 = 0
  // --------------------------
  // - len = 8 -> neededQubits = 32
  // - backendQubits = 5
  // - blocksNumber = 32 / 5 = 6.5 -> 6, 6*5 = 35
  // - blocksNumberExtra = 32 % 5 = 2
  const circuitsNumber = Math.floor(neededQubits / backendQubits);
  const circuitExtraQubits = neededQubits % backendQubits;
  dbg('Parameters', { backendQubits, circuitsNumber, circuitExtraQubits });

  utils.times(circuitsNumber, () => circuits.push(circuit));

  dbg('Built circuits', { circuits });

  if (circuitExtraQubits) {
    const circuitExtra = buildCircuit(circuitExtraQubits);
    dbg('Built circuit (extra)', { circuitExtra });

    circuits.push(circuitExtra);
  }

  return circuits;
};
