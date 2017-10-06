/*
  Copyright IBM Corp. 2017. All Rights Reserved.

  This code may only be used under the Apache 2.0 license found at
  http://www.apache.org/licenses/LICENSE-2.0.txt.

  Authors:
  - John Smolin (original code)
  - Jay Gambetta (original code)
  - Ismael Faro <Ismael.Faro1@ibm.com>
  - Jesús Pérez <jesusper@us.ibm.com>
*/

/*
  (Slow) Javascript simulator that returns the unitary of the circuit.

  It simulates a unitary of a quantum circuit that has been compiled to run on
  the simulator. It is exponential in the number of qubits.

  The input is the circuit object and the output is the same circuit object with
  a result field added results['data']['unitary'] where the unitary is
  a 2**n x 2**n complex numpy array representing the unitary matrix.
*/

'use strict';

// TODO: Maybe we need a class also here, if it has sense for the simulator
// to have state. Moreover maybe we need to emit events, see TODOs below.

const math = require('mathjs');

const utils = require('./utils');
// const unroll = require('./qasm/unroll');
const gateSingle = require('./gateSingle');
const gateTwo = require('./gateTwo');


const dbg = utils.dbg(__filename);
const complex = math.complex(1, 0);
// TODO: Why? Different CX matrix than in the web, which is the correct one?
const gateCx = math.matrix([
  [1, 0, 0, 0],
  [0, 0, 0, 1],
  [0, 0, 1, 0],
  [0, 1, 0, 0],
]);
const n1j = math.complex(0, 1);
// Not supported ops.
const toDrop = ['measure', 'barrier', 'reset'];


module.exports = (circuit) => {
  dbg(`Simulator started: ${circuit}`);

  if (!circuit) { throw new Error('Empty circuit'); }

  const drops = [];
  // TODO: For QASM we need to unroll it before.
  // const circuitUnrolled = unroll(circuit)

  let numQbits = 0;
  // TODO: Add check "isInt"?
  if (circuit.header && circuit.header.number_of_qubits) {
    numQbits = circuit.header.number_of_qubits;
  }

  let numOperations = 0;
  // TODO: Add check "isArray"?
  if (circuit.operations) { numOperations = circuit.operations.length; }

  let state = math.chain(math.eye(math.pow(2, numQbits)))
    .multiply(complex)
    .done();

  // TODO: Use an iterator for huge circuits.
  dbg('Starting iterations over ops', { numOperations, numQbits });

  utils.each(circuit.operations, (op) => {
    dbg('Turn for op', op);
    // TODO: Check for name presence (and the rest needed fields) -> parsing error
    if (op.name === 'U') {
      const qubit = op.qubits[0];
      const theta = op.params[0];
      const phi = op.params[1];
      const lam = op.params[2];

      dbg('"U" gate detected', {
        qubit, theta, phi, lam,
      });

      const m11 = math.cos(theta / 2.0);

      const n1jNlam = math.multiply(n1j, lam);
      const m12 = math.multiply(math.multiply(math.exp(n1jNlam), -1), math.sin(theta / 2.0));

      const n1jNphi = math.multiply(n1j, phi);
      const m21 = math.multiply(math.exp(n1jNphi), math.sin(theta / 2.0));

      const m22 = math.multiply(math.exp(math.add(n1jNphi, n1jNlam)), math.cos(theta / 2.0));

      const gate = math.matrix([
        [m11, m12],
        [m21, m22],
      ]);

      dbg('New gate created');
      dbg(gate.toString());

      state = gateSingle(gate, qubit, numQbits, state);
    } else if (op.name === 'CX') {
      const qubit0 = op.qubits[0];
      const qubit1 = op.qubits[1];

      dbg('"CX" gate detected', { qubit0, qubit1 });

      state = gateTwo(gateCx, qubit0, qubit1, numQbits, state);
    } else if (utils.includes(toDrop, op.name)) {
      dbg('Not supported operation dropped', op);
      drops.push(op);
    } else {
      throw new Error(`Parsing error: ${JSON.stringify(op)}`);
    }
  });

  return { state, drops };
};
