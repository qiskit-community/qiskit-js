# QISKit.js OpenQASM

:atom_symbol: Quantum Information Software Kit [OpenQASM](https://github.com/IBM/qiskit-openqasm) library.

Please visit the [main repository](https://github.ibm.com/IBMResearch/qiskit.js) of the project to know about the rest of the tools.

## Install

:coffee: Install [Node.js](https://nodejs.org/download) and then:

```sh
# Install (or upgrade) the module.
npm i -g IBMResearch/qiskit.js

# TODO: When published in npm.
# npm i -g qiskit-qasm
```

## Use

:pencil: You can visit the complete example [in this test](./test/functional/parse.js).

```js
const qasm = require('qiskit').qasm;
// TODO: When published to npm
// const qasm = require('qiskit-qasm');

console.log('Version');
console.log(qasm.version);

const circuit = fs.readFileSync('./example.qasm', 'utf8');

console.log(util.inspect(parse(circuit), { depth: null }));
```

## API

:eyes: Full specification.

### `version -> versionRes`

Get the actual version of the library.

- `versionRes` (string) - Version number.

### `parse(circuit) -> circuitJson`

Get the intermediate representation of the circuit using the OpenQASM parser.

- `circuit` (string) - QASM circuit representation.
- `circuitJson` (object): The same information in JSON format.

### `qasm.QasmError(msg, opts) -> error`

Custom QASM error class.

- `msg` (string) - Error message.
- `opts` (object) - Optional parameter, including next fields:
  - `line` (number) - Line number where the error happened.
  - `column` (number) - Column number where the error happened.
  - `text` (string) - Text extracted from where the error happened.
  - `token` (string) - Identifier found where the error happened.
  - `expected` (string) - Regular expresion for supported values.
- `Error` (Error) - A common JS error including also next fields:
  - `name` (string) - Error name ("QasmError").
  - `message` (string) - Error message.
  - `stack` (string) - Error stack.
  - From here the same fields that for `opts` are included.
