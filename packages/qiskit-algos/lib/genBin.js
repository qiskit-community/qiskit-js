/*
  Copyright Jesús Pérez <jesusprubio@fsf.org>

  This code may only be used under the MIT license found at
  https://opensource.org/licenses/MIT.
*/

'use strict';

const Qe = require('@qiskit/qe');

const utils = require('./utils');
const { name } = require('../package');
const { backends } = require('../cfg');
const buildCircuits = require('./buildCircuits');

const dbg = utils.debug(name);

function buildParam(circuit) {
  return { qasm: circuit };
}

module.exports = async (token, userId, opts = {}) => {
  const len = opts.length || 16;
  const backend = opts.backend || 'ibmqx4';
  const qe = new Qe();

  qe.token = token;
  qe.userId = token;

  const backendQubits = backends[backend].nQubits;
  const circuits = buildCircuits(len, backendQubits);
  const circuitsMassaged = utils.map(circuits, buildParam);

  // Marking it to know how to parse the response later'
  // TODO: It would be better to mark the whole job, but the library and/or API
  // doesn't support it for now.
  circuitsMassaged[0].name = 'random';
  dbg('Massaged circuits', circuitsMassaged);

  const res = await qe.runBatch(circuitsMassaged, {
    backend: opts.backend || 'simulator',
    shots: opts.shots || 1,
    maxCredits: opts.maxCredits || null,
  });

  if (!res.status || res.status !== 'RUNNING') {
    throw new Error(`Running the circuit: ${res}`);
  }

  return res.id;
};
