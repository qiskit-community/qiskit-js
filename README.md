# Qiskit.js

[![Build Status](https://travis-ci.com/Qiskit/qiskit-js.svg?branch=master)](https://travis-ci.com/Qiskit/qiskit-js)
[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

:atom_symbol: [Quantum Information Science Kit](https://qiskit.org) for JavaScript.

<div align="center">
	<p>
    <img src="https://diego-plan9.github.io/_static/qiskit-logo-white-no-margin.gif" alt="logo">
	</p>
	<p>
		<sub>:gift: Follow us on <a href="https://twitter.com/qiskit"><code>Twitter</code></a> if you like this project</sub>
	</p>
</div>

:bulb: I was born as a clone (in JS) of [my big brother](https://github.com/Qiskit/qiskit-sdk-py).

**Alpha**: Until v1 breaking changes could be included.

## Philosophy

:orange_book: The basic concept of our quantum program is an array of quantum circuits. The program workflow consists of three stages: Build, Compile, and Run. Build allows you to make different quantum circuits that represent the problem you are solving. Compile allows you to rewrite them to run on different backends (simulators/real chips of different quantum volumes, sizes, fidelity, etc); and Run launches the jobs. After the jobs have been run, the data is collected. There are methods for putting this data together, depending on the program. This either gives you the answer you wanted or allows you to make a better program for the next instance.

If you want to learn more about Quantum Computing, you're invited to visit our [Quamtum Experience](https://quantumexperience.ng.bluemix.net) project.

## Structure

:handbag: The components of this repository are exposed as these libraries:

* [qiskit](./packages/qiskit): Meta-package, documented in this file. It also includes a command line client, which is your friend if you want to play with all these features without having to use any programming language.
* [@qiskit/devs](./packages/qiskit-devs): High level algorithms, thought for developers.
  * [@qiskit/devs-js](./packages/qiskit-devs-js): JavaScript engine.
  * [@qiskit/devs-anu](./packages/qiskit-devs-anu): [Australian National University](http://www.anu.edu.au) [Quantum Random Numbers Server](https://qrng.anu.edu.au) engine.
  * [@qiskit/devs-ibm](./packages/qiskit-devs-ibm): Quantum Experience engine.
* [@qiskit/cloud](./packages/qiskit-cloud): Library to make easier the interaction with the Quantum Experience.
* [@qiskit/utils](./packages/qiskit-utils): Helpers shared among all packages.
* [@qiskit/qasm](./packages/qiskit-qasm): Some [OpenQASM](https://github.com/IBM/qiskit-openqasm) tools, like parser.
* [@qiskit/sim](./packages/qiskit-sim): An experimental JS simulator for OpenQASM circuits we're working on.

### Qiskit for the browser

:inbox_tray: All components are compatible with [browserify](http://browserify.org).

## Install

:coffee: Install last [Node.js](https://nodejs.org/download) stable version (or LTS) and then:

```sh
npm i -g qiskit
```

## Use

### CLI

:rocket: The command line client allows to play with the circuits without having to use any programming language API.

```sh
qiskitjs --help
```

### Programatically

:pencil: As you can see in the next section, we have to use it like in the rest of independent modules. The only difference is we need to select the proper field of the main object before.

```js
const qiskit = require('qiskit');

console.log(`True random numbers\n')

qiskit.devs.random()
  .then(rand => console.log(`- JavaScript: ${rand}`));

const cloud = new qiskit.Cloud();
cloud.login('YOUR_PERSONAL_TOKEN_HERE')
  .then(() => {
    qiskit.devs.random({
      engine: 'ibm',
      custom: cloud,
      // default: simulator
      // engine: "ibmqx4"
    })
    .then(rand => console.log(`- IBM Cloud: ${rand}`))
  });

qiskit.devs.random({
  engine: 'anu',
  length: 8,
}).then(rand => console.log(`ANU Server: ${rand}`));
```

## API

:eyes: Full specification.

### `version`

The actual version of the library.

* `version` (string) - Version number.

### `qasm`

A wrapper for the [`qiskit-qasm`](./packages/qiskit-qasm) project.

* `qasm` (object) - The same object provided in the original library.

### `sim`

A wrapper for the [`qiskit-sim`](./packages/qiskit-sim) project.

* `sim` (object) - The same object provided in the original library.

### `Cloud`

A wrapper for the [`qiskit-cloud`](./packages/qiskit-cloud) project.

* `Cloud` (object) - The same constructor provided in the original library.

### `utils`

A wrapper for the [`qiskit-utils`](./packages/qiskit-utils) project.

* `utils` (object) - The same object provided in the original library.

### `devs`

A wrapper for the [`qiskit-devs`](./packages/qiskit-devs) project.

* `devs` (object) - The same object provided in the original library.

## Authors

:alien: https://github.com/Qiskit/qiskit-js/graphs/contributors

Original code (Python) authors [here](https://github.com/Qiskit/qiskit-sdk-py#authors-alphabetical).

## Other Qiskit projects

:school_satchel:

* [Python Qiskit](https://github.com/Qiskit/qiskit-sdk-py.git>)
* [ibmqx backend information](https://github.com/Qiskit/ibmqx-backend-information): Information about the different IBM Q experience backends.
* [ibmqx user guide](https://github.com/Qiskit/ibmqx-user-guides): The users guides for the IBM Q experience.
* [OpenQasm](https://github.com/Qiskit/openqasm): Examples and tools for the OpenQASM intermediate representation.
* [Python API](https://github.com/Qiskit/qiskit-api-py): API Client to use IBM Q experience in Python.
* [Tutorials](https://github.com/Qiskit/qiskit-tutorial): Jupyter notebooks for using Qiskit.

## License

:penguin: Qiskit is released under the [Apache license, v2.0](https://www.apache.org/licenses/LICENSE-2.0).

## Do you want to help?

:sunglasses: If you'd like to help please take a look to our [contribution guidelines](./CONTRIBUTING.md).
