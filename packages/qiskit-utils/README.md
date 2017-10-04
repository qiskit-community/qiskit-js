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
