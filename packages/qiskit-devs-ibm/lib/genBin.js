/**
 * @license
 *
 * Copyright (c) 2017, IBM.
 *
 * This source code is licensed under the Apache License, Version 2.0 found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const Cloud = require('@qiskit/cloud');

const utils = require('./utils');
const { backends } = require('../cfg');
const buildCircuits = require('./buildCircuits');

const dbg = utils.debug(__filename);

function buildParam(circuit) {
  return { qasm: circuit };
}

// TODO: Reuse "utils.genRandom" like in the other "qiskit-devs=*" packages.
module.exports = async (token, userId, opts = {}) => {
  const len = opts.length || 16;
  const backend = opts.backend || 'ibmqx4';
  const cloud = new Cloud();

  cloud.token = token;
  cloud.userId = token;

  const backendQubits = backends[backend].nQubits;
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
