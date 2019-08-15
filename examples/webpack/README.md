### Qiskit/qasm Webpack example
The purpose of this project is to serve as an example of how the qiskit-js QASM
parser can be used in a browser environment.

### Install
```console
$ npm i
$ npm run init
```
The init run-script is only required because the current version of qiskit/qasm
does not distribute the `qelib1.inc` file. This has been fixed and will not
be required in the future.

### Build
```
$ npm run build
```

### Run
```console
$ open dist/index.html
```
