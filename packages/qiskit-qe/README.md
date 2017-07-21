# QISKit.js OpenQASM

:atom_symbol: Quantum Information Software Kit library to use the [Quamtum Experience](https://quantumexperience.ng.bluemix.net).

Please visit the [main repository](https://github.ibm.com/IBMResearch/qiskit.js) of the project to know about the rest of the tools.

## Install

:coffee: Install [Node.js](https://nodejs.org/download) and then:

```sh
# Install (or upgrade) the module.
npm i -g IBMResearch/qiskit.js

# TODO: When published in npm.
# npm i -g qiskit-qe
```

## Use

:pencil: You can visit the complete example [in this test](./test/functional/index.js).

```js
const qe = require('qiskit').qe;
// TODO: When published to npm
// const qe = require('qiskit-qe');

console.log('Version');
console.log(qe.version);

const circuit = fs.readFileSync('./example.qasm', 'utf8');

// TODO
// console.log(util.inspect(parse(circuit), { depth: null }));
```

## API

:eyes: Full specification.

### `version -> versionRes`

Get the actual version of the library.


TODO FROM HERE
