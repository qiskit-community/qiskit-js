# QISKit.js simulator

:atom_symbol: [Quantum Information Software Kit](https://developer.ibm.com/open/openprojects/qiskit) simulator in pure JavaScript. As a first feature it includes an unitary one for [OpenQASM](https://github.com/IBM/qisim.js-openqasm) circuits representation.

Please visit the [main repository](https://github.ibm.com/IBMResearch/qiskit.js) to know more about the rest of the project tools.

## Install

:coffee: Install [Node.js](https://nodejs.org/download) and then:

```sh
npm i qiskit-sim
```

## Use

:pencil: You can visit the complete example [in this test](./test/functional/run.js).

```js
const sim = require('qiskit-sim');

console.log('Version');
console.log(sim.version);

const circuit = fs.readFileSync('./example.qasm', 'utf8');

console.log('Simulation started ...');
const res = sim.run(circuit);
console.log('Result:');
console.log(res);
```

## API

:eyes: Full specification.

### `version`

The actual version of the library.

- `version` (string) - Version number.

### `unroll(circuit) -> circuitUnrolled`

**NOTE: Method still not implemented**
Get the extended representation of the circuit for this simulator.

- `circuit` (string) - QASM circuit representation.
- `circuitUnrolled` (object): Extended (also JSON) circuit.

### `gateSingle(gate, qubit, nQubits, stateOld) -> stateNew`

Apply a single-qubit gate.

- `gate` (object, [Math.js matrix](http://mathjs.org/docs/datatypes/matrices.html)) - Single-qubit gate to apply.
- `qubit` - Qubit to apply on, counts from 0. Order is q_{n-1} ... otimes q_1 otimes q_0.
- `nQubits` (number) - Number of qubits of the system.
- `state` (object, Math.js matrix) - Internal state of the simulator before the gate.
- `stateNew` (object, Math.js matrix) - Internal state of the simulator after the gate.

### `gateTwo(gate, qubit0, qubit1, nQubits, state) -> stateNew`

Apply a two-qubit gate.

- `gate` (object, Math.js matrix) - Two-qubit gate to apply.
- `qubit0` - First qubit (control), counts from 0.
- `qubit1` - Second qubit (target).
- `nQubits` (number) - Number of qubits of the system.
- `state` (object, Math.js matrix) - Internal state of the simulator before the gate.
- `stateNew` (object, Math.js matrix) - Internal state of the simulator after the gate.

### `run(circuit) -> result`

Run a simulation.

- `circuit` (string) - QASM circuit representation. For now only an "unrolled" (intermediate, JSON format) version of them is accepted.
- `result` (object):
  - `drops` (array) - Not supported (omitted) operations present in the circuit.
  - `state` (object, Math.js matrix) - Internal state of the simulator after the run.
