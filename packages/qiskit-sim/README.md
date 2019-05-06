# Qiskit.js simulator

:atom_symbol: [Quantum Information Science Kit](https://developer.ibm.com/open/openprojects/qiskit) simulator in pure JavaScript. As a first feature it includes an unitary one, with specific support for [OpenQASM](https://github.com/Qiskit/openqasm) circuits representation.

Please visit the [main repository](https://github.com/Qiskit/qiskit-js) to know more about the rest of the project tools.

## Install

:coffee: Install lastest [Node.js](https://nodejs.org/download) stable version (or LTS) and then:

```sh
npm i @qiskit/sim
```

## Use

:pencil: You can visit more complete examples [in the tests](./test).

```js
const util = require('util');

const { Circuit, Gate } = require('@qiskit/sim');

function randomizeInput(nQubits) {
  const input = [];

  for (let i = 0; i < nQubits; i += 1) {
    const x = !!Math.round(Math.random());
    input.push(x);

    console.log(`${i}:${x ? '|1>' : '|0>'}`);
  }

  return input;
}

const circuit = Circuit.createCircuit(2);

circuit.add(Gate.h, 0, 0);
circuit.add(Gate.cx, 1, [0, 1]);
circuit.print();

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

### `circuit.addGate(gate, column, wires)`

Add a gate to the circuit.

* `gate` (Gate|string) - Gate instance or name of the gate, from `gates` field.
* `column` (number) - Qubit to connect the gate.
* `wires` (number / [number]) - Gate connections. An array is used for multi-gates.

### `circuit.add(gate, column, wires)`

Add a gate to the circuit. This function is identical to `addGate` but only
accepts `Gate` instances.

* `gate` (Gate) - Gate instance to add to the circuit.
* `column` (number) - Qubit to connect the gate.
* `wires` (number / [number]) - Gate connections. An array is used for multi-gates.

### `circuit.print([writable])`

Prints a visual representation of the circuit to standard out (by default).

* `writable` (object) - Optional [Writable](https://nodejs.org/api/stream.html#stream_writable_streams)
object which will be written to. Defaults to process.stdout.

### `circuit.run(input)`

Make the simulation.

* `input` ([boolean]) - Initial state of each qubit.

### `circuit.save() -> circuitIr`

Export the circuit setup for a future reuse.

* `circuitIr` (object) - Simulator internal representation of the circuit (JSON).

### `circuit.load(circuitIr)`

Import a circuit setup.

* `circuitIr`
