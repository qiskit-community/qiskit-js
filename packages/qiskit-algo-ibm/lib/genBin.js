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
const buildCircuits = require('./buildCircuits');

const dbg = utils.debug(__filename);

function buildParam(circuit) {
  return { qasm: circuit };
}

// TODO: Reuse "utils.genRandom" like in the other "qiskit-algo=*" packages.
module.exports = async (cloud, opts = {}) => {
  const len = opts.length || 16;
  const backendName = opts.backend || 'simulator';

  const backendQubits = (await cloud.backend(backendName)).nQubits;
  const circuits = buildCircuits(len, backendQubits);
  const circuitsMassaged = utils.map(circuits, buildParam);

  // Marking it to know how to parse the response later'
  // TODO: It would be better to mark the whole job, but the library and/or API
  // doesn't support it for now.
  circuitsMassaged[0].name = 'random';
  dbg('Massaged circuits', circuitsMassaged);

  const res = await cloud.runBatch(circuitsMassaged, {
    backend: opts.backend || 'simulator',
    shots: opts.shots || 1,
    maxCredits: opts.maxCredits || null,
  });

  if (!res.status || res.status !== 'RUNNING') {
    throw new Error(`Running the circuit: ${res}`);
  }

  return res.id;
};
