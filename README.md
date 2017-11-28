# QISKit.js

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)
[![Build Status](https://travis.ibm.com/IBMResearch/qiskit.js.svg?token=GMH4xFrA9iezVJKqw2zH&branch=master)](https://travis.ibm.com/IBMResearch/qiskit.js)

:atom_symbol: [Quantum Information Software Kit](https://developer.ibm.com/open/openprojects/qiskit) in pure JavaScript.

:bulb: This project born as a clone (in JS) of [its big brother](https://github.com/QISKit/qiskit-sdk-py).

## Philosophy

:orange_book: The basic concept of our quantum program is an array of quantum circuits. The program workflow consists of three stages: Build, Compile, and Run. Build allows you to make different quantum circuits that represent the problem you are solving. Compile allows you to rewrite them to run on different backends (simulators/real chips of different quantum volumes, sizes, fidelity, etc); and Run launches the jobs. After the jobs have been run, the data is collected. There are methods for putting this data together, depending on the program. This either gives you the answer you wanted or allows you to make a better program for the next instance.

If you want to learn more about Quantum Computing, you're invited to visit our [Quamtum Experience](https://quantumexperience.ng.bluemix.net) project.

## Structure

:handbag: This repository include next tools. Please visit the specific documentation you need:

- @qiskit/cli: Meta-package, documented in this file. It also includes a command line client, which is your friend if you want to play with some OpenQASM circuits (in the Quantum Experience or the local simulator) without having to use any other programming language.
- [@qiskit/qasm](./packages/qiskit-qasm): [OpenQASM](https://github.com/IBM/qiskit-openqasm) library, including the parser.
- [@qiskit/qe](./packages/qiskit-qe): Send circuits to the Quantum Experience.
- [@qiskit/sim](./packages/qiskit-sim): Local simulator for OpenQASM circuits.
- [@qiskit/utils](./packages/qiskit-utils): Helpers shared among all packages.
- [QISKit for the browser](./dist): A bundled version with the same stuff ready to be used in the browser.

## Install

:coffee: Install [Node.js](https://nodejs.org/download) v8 and then:

```sh
npm i -g @qiskit/cli
```

## Use

### CLI

:rocket: The command line client allows to play with the circuits without having to use any language API.

```sh
qiskitjs --help
```

### Programatically

:pencil: As you can see in the next section, we have to use it like in the rest of independent modules. The only difference is we need to select the proper field of the main object before.

```js
const qiskitCli = require('@qiskit/cli');

console.log('Simulator version');
console.log(qiskitCli.sim.version);
```

## API

:eyes: Full specification.

### `version`

The actual version of the library.

- `version` (string) - Version number.

### `qasm`

A wrapper fot the [`qiskit-qasm`](./packages/qiskit-qasm) project.

- `qasm` (object) - The same object provided in the original library.

### `sim`

A wrapper fot the [`qiskit-sim`](./packages/qiskit-sim) project.

- `sim` (object) - The same object provided in the original library.

### `Qe`

A wrapper fot the [`qiskit-qe`](./packages/qiskit-qe) project.

- `Qe` (object) - The same constructor provided in the original library.

### `utils`

A wrapper fot the [`qiskit-qe`](./packages/qiskit-utils) project.

- `utils` (object) - The same object provided in the original library.

## Authors (alphabetical)

:alien: Ismael Faro, Jesús Pérez, Jorge Carballo.

Original code (Python) authors [here](https://github.com/QISKit/qiskit-sdk-py#authors-alphabetical).

In future releases, anyone who contributes code to this project can include their name here.

## Other QISKit projects

:school_satchel:

- [Python QISKit](https://github.com/QISKit/qiskit-sdk-py.git>)
- [ibmqx backend information](https://github.com/QISKit/ibmqx-backend-information): Information about the different IBM Q experience backends.
- [ibmqx user guide](https://github.com/QISKit/ibmqx-user-guides): The users guides for the IBM Q experience.
- [OpenQasm](https://github.com/QISKit/openqasm): Examples and tools for the OpenQASM intermediate representation.
- [Python API](https://github.com/QISKit/qiskit-api-py): API Client to use IBM Q experience in Python.
- [Tutorials](https://github.com/QISKit/qiskit-tutorial): Jupyter notebooks for using QISKit.

## License

:penguin: QISKit is released under the [Apache license, v2.0](https://www.apache.org/licenses/LICENSE-2.0).

## Do you want to help?

:sunglasses: If you'd like to help please take a look to our [contribution guidelines](./CONTRIBUTING.md).
