# QISKit.js

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Build Status](https://travis.ibm.com/IBMResearch/qisim.js.svg?token=GMH4xFrA9iezVJKqw2zH&branch=master)](https://travis.ibm.com/IBMResearch/qisim.js)

:atom_symbol: [Quantum Information Software Kit](https://developer.ibm.com/open/openprojects/qiskit) in pure JavaScript. Main package, including all the tools.

## Install

:coffee: Install [Node.js](https://nodejs.org/download) and then:

```sh
# Install (or upgrade) the module.
npm i -g IBMResearch/qiskit.js

# TODO: When published in npm.
# npm i -g qiskit
```

## Use

### CLI

:rocket: The command line client allows to play with the circuits without having to use any language API.

```sh
Commands:
  parse <circuit>           Parse the circuit to our intermediate JSON format [aliases: p]
  qe <circuit> <key>        Send the circuit to the Quantum Experience (https://quantumexperience.ng.bluemix.net) [aliases: q]
  sim <circuit> [unrolled]  Simulate the circuit using the unitary simulator [aliases: s]
  unroll <circuit>          Extend the circuit with the unitary simulator unroller [aliases: u]
```

```sh
qiskit.js -h

qiskit.js sim ./circuits/example.qasm
qiskit.js sim ./circuits/unrolled/example.json true
qiskit.js qe ./circuits/example.qasm
qiskit.js parse ./circuits/example.qasm
qiskit.js unroll ./circuits/example.qasm

```

### Programatically

:pencil: As you can see in the next section, we have to use it like in the rest of independent modules. The only difference is we need to select the proper field of the main object before.

```js
const qiskit = require('qiskit');

console.log('Simulator version');
console.log(qiskit.sim.version);
```

## API

:eyes: Full specification.

### `version`

The actual version of the library.

- `version` (string) - Version number.

### `qasm`

A wrapper fot the [`qiskit-qasm`](../qiskit-qasm) project.

- `qasm` (object) - The same object provided in the original library.

### `sim`

A wrapper fot the [`qiskit-sim`](../qiskit-sim) project.

- `sim` (object) - The same object provided in the original library.

### `Qe`

A wrapper fot the [`qiskit-qe`](../qiskit-qe) project.

- `Qe` (object) - The same constructor provided in the original library.

### `utils`

A wrapper fot the [`qiskit-qe`](../qiskit-utils) project.

- `utils` (object) - The same object provided in the original library.
