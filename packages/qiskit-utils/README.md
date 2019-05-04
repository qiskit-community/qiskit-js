# Qiskit.js utils

:atom_symbol: Quantum Information Science Kit utils library, shared among the rest of the qiskit-\* packages.

Please visit the [main repository](https://github.com/Qiskit/qiskit-js) of the project to know about the rest of the tools.

## Install

:coffee: Install lastest [Node.js](https://nodejs.org/download) stable version (or LTS) and then:

```sh
npm i @qiskit/utils
```

## Use

:pencil: You can visit the complete example [in this test](./test/functional.js).

```js
const utils = require('@qiskit/utils');

console.log('Version');
console.log(utils.version);
```

## API

:eyes: Full specification.

### `version`

The actual version of the library.

* `version` (string) - Version number.

### `debug`

Our debugger. A wrapper for [debug](https://github.com/visionmedia/debug).

* `debug` (object) - The same object provided in the original library.

### `pathToTag(fullPath) -> tag`

To get a consistent tag among all the project debugging. So we use with the `debug` method.

* `fullPath` (string) - The full path of the file we're debugging.
* `tag` (string) - The name of the file.

### `ayb`

A wrapper for [ayb](https://github.com/nerddiffer/all-your-base).

* `ayb` (object) - The same object provided in the original library.
