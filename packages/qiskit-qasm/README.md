# Qiskit.js OpenQASM

:atom_symbol: Quantum Information Science Kit [OpenQASM](https://github.com/IBM/qiskit-openqasm) library.

Please visit the [main repository](https://github.com/Qiskit/qiskit-js) of the project to know about the rest of the tools.

## Install

:coffee: Install lastest [Node.js](https://nodejs.org/download) stable version (or LTS) and then:

```sh
npm i @qiskit/qasm
```

## Use

:pencil: You can visit the complete example [in this test](./test/functional/).

```js
const qasm = require('@qiskit/qasm');
const fs = require('fs');
const util = require('util');

console.log('Version');
console.log(qasm.version);

const parser = new qasm.Parser();

const circuit = fs.readFileSync('./example.qasm', 'utf8');

console.log(util.inspect(parser.parse(circuit), { depth: null }));
```

## API

:eyes: Full specification.

### `version`

The actual version of the library.

* `version` (string) - Version number.

### `Parser(opts) -> parser`

The constructor accepts next option:

* `core` (boolean) - To include core libraries. (default: true)

### `parser.parse(circuit) -> circuitJson`

**NOTE: Method still partially implemented**
Get the intermediate representation of the circuit using the OpenQASM parser.

* `circuit` (string) - QASM circuit representation.
* `circuitJson` (object): The same information in JSON format.

### `QasmError(msg, opts) -> error`

Custom QASM error class.

* `msg` (string) - Error message.
* `opts` (object) - Optional parameter, including next fields:
  * `line` (number) - Line number where the error happened.
  * `column` (number) - Column number where the error happened.
  * `text` (string) - Text extracted from where the error happened.
  * `token` (string) - Identifier found where the error happened.
  * `expected` (string) - Regular expresion for supported values.
* `error` (Error) - A common JS error including also next fields:
  * `name` (string) - Error name ("QasmError").
  * `message` (string) - Error message.
  * `stack` (string) - Error stack.
  * From here the same fields that for `opts` are included.
