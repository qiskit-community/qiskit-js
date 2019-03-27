# Qiskit.js simulator

:atom_symbol: [Quantum Information Science Kit](https://developer.ibm.com/open/openprojects/qiskit) simulator in pure JavaScript. As a first feature it includes an unitary one, with specific support for [OpenQASM](https://github.com/Qiskit/openqasm) circuits representation.

Please visit the [main repository](https://github.com/Qiskit/qiskit-js) to know more about the rest of the project tools.

## Install

:coffee: Install [Node.js](https://nodejs.org/download) v8 and then:

```sh
npm i @qiskit/sim
```

## Use

:pencil: You can visit more complete examples [in the tests](./test).

```js
const util = require('util');

const sim = require('@qiskit/sim');

function randomizeInput(nQubits) {
  const input = [];

  for (let i = 0; i < nQubits; i += 1) {
    const x = !!Math.round(Math.random());
    input.push(x);

    console.log(`${i}:${x ? '|1>' : '|0>'}`);
  }

  return input;
}

const circuit = new sim.Circuit({ nQubits: 2 });

circuit.addGate(sim.Gate.h, 0, 0);
circuit.addGate(sim.Gate.cx, 1, [0, 1]);

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
```

## API

:eyes: Full specification.

### `version`

The actual version of the library.

* `version` (string) - Version number.

### `gates`

Gates definition.

* `gates` (object) - Supported gates definition.

### `Circuit(opts) -> circuit`

* `opts` (object) -The constructor accepts next options:
  * `nQubits` (number) - Number of qubits needed to run the circuit. It will be automatically updated by the `addGate` method if needed.
* `circuit` (object) - New instance.

### `circuit.state`

* `state` (object, [Math.js matrix](http://mathjs.org/docs/datatypes/matrices.html)) - Internal state of the simulation.

### `circuit.stateToString() -> stateStr`

* `stateStr` (string) - Human friendly representation of the internal state.

### `circuit.addGate(name, column, wires)`

Add a gate to the circuit.

* `name` (string) - Name of the gate, from `gates` field.
* `colum` (number) - Qubit to connect the gate.
* `wires` (number / [number]) - Gate connections. An array is used for multi-gates.

### `circuit.run(input)`

Make the simulation.

* `input` ([boolean]) - Initial state of each qubit.

### `circuit.save() -> circuitIr`

Export the circuit setup for a future reuse.

* `circuitIr` (object) - Simulator internal representation of the circuit (JSON).

### `circuit.load(circuitIr)`

Import a circuit setup.

* `circuitIr`
