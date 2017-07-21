# QISKit.js

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Build Status](https://travis.ibm.com/IBMResearch/qiskit.js.svg?token=GMH4xFrA9iezVJKqw2zH&branch=master)](https://travis.ibm.com/IBMResearch/qisim.js)

:atom_symbol: [Quantum Information Software Kit](https://developer.ibm.com/open/openprojects/qiskit) in pure JavaScript.

:bulb: This project born as a clone (in JS) of [this another one](https://github.com/IBM/qisim.js-sdk-py).

## Philosophy

:orange_book: The basic concept of our quantum program is an array of quantum circuits. The program workflow consists of three stages: Build, Compile, and Run. Build allows you to make different quantum circuits that represent the problem you are solving. Compile allows you to rewrite them to run on different backends (simulators/real chips of different quantum volumes, sizes, fidelity, etc); and Run launches the jobs. After the jobs have been run, the data is collected. There are methods for putting this data together, depending on the program. This either gives you the answer you wanted or allows you to make a better program for the next instance.

If you want to learn more about Quantum Computing, you're invited to visit our [Quamtum Experience](https://quantumexperience.ng.bluemix.net) project.

## Tools

:handbag: This repository include next tools. Please visit the specific documentation you need:
- [qiskit](./packages/qiskit): Meta-package, use it if you need all of them. Moreover it includes a command line client, which is your friend if you want to play with some circuits (in local simulator or QE) without having to write any line of code.
- [qiskit-qasm](./packages/qiskit-qasm): [OpenQASM](https://github.com/IBM/qiskit-openqasm) library including the specification, parser, etc.
- [qiskit-qe](./packages/qiskit-qe): Send circuits to the Quantum Experience.
- [qiskit-sim](./packages/qiskit-sim): Local simulator for OpenQASM circuits.
- [qiskit for the browser](./dist): A bundled version with the same stuff ready to be used in the browser.


## Contributing

:sunglasses: If you'd like to help please take a look to our [contribution guidelines](https://github.com/IBMResearch/contributing).
