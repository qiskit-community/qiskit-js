/**
 * @license
 *
 * Copyright (c) 2017, IBM.
 *
 * This source code is licensed under the Apache License, Version 2.0 found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const util = require('util');

const sim = require('..');

function randomizeInput(nQubits) {
  const input = [];

  for (let i = 0; i < nQubits; i += 1) {
    const x = !!Math.round(Math.random());
    input.push(x);

    /* eslint-disable no-console */
    console.log(`${i}:${x ? '|1>' : '|0>'}`);
  }

  return input;
}

const circuit = new sim.Circuit({ nQubits: 2 });

circuit.addGate('h', 0, 0);
circuit.addGate('cx', 1, [0, 1]);

console.log('\nInput randomized (as string):');
const input = randomizeInput(circuit.nQubits);

console.log('\nInput randomized:');
console.log(input);

console.log('\nRunning the circuit now ...');
circuit.run(input);

console.log('\nDone, internal state:');
console.log(circuit.state);

console.log('\nInternal state (as string):');
console.log(circuit.stateToString());

const circuitIr = circuit.save();
console.log('\nSaved IR:');
console.log(util.inspect(circuitIr, { showHidden: false, depth: null }));
/* eslint-enable no-console */
