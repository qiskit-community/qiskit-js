# QISKit.js OpenQASM

:atom_symbol: Quantum Information Software Kit utils library, shared among the rest of the qiskit-* packages.

Please visit the [main repository](https://github.ibm.com/IBMResearch/qiskit.js) of the project to know about the rest of the tools.

## Install

:coffee: Install [Node.js](https://nodejs.org/download) and then:

```sh
# Install (or upgrade) the module.
npm i -g IBMResearch/qiskit.js

# TODO: When published in npm.
# npm i -g qiskit-utils
```

## Use

:pencil: You can visit the complete example [in this test](./test/functional/index.js).

```js
const { utils } = require('qiskit');
// TODO: When published to npm
// const utils = require('qiskit-utils');

console.log('Version');
console.log(utils.version);
```

## API

:eyes: Full specification.

### `version`

The actual version of the library.

- `version` (string) - Version number.

### `debug`

Our debugger. A wrapper for [debug](https://github.com/visionmedia/debug).

- `debug` (object) - The same object provided in the original library.

### `pathToTag(fullPath) -> tag`

To get a consistent tag among all the project debugging. So we use with the `debug` method.

- `fullPath` (string) - The full path of the file we're debugging.
- `tag` (string) - The name of the file.

### `validator`

To validate multiple common type from strings. A wrapper for [validator.js](https://github.com/chriso/validator.js).

- `validator` (object) - The same object provided in the original library.

### `promisify(function) -> promise`

To get promises from error-first callback functions. A wrapper for [es6-promisify](https://github.com/digitaldesignlabs/es6-promisify).

- `promise` (object) - A promise version of the function.

### `throwsAsync(block, errRegex) -> promise`

A custom version of [assert.throws](https://nodejs.org/api/assert.html#assert_assert_throws_block_error_message) with async (through promises) support.

- `block` (function) - Piece of code (returning a promise) to be checked.
- `errRegex` (object) - Regular expresion to confirm the expected error.
