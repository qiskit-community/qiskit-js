# QISKit.js for the browser

:atom_symbol: Quantum Information Software Kit for the browser.

Please visit the [main repository](https://github.ibm.com/IBMResearch/qiskit.js) of the project to know about the rest of the tools.


## Install

:download??: It's available in [Bower](https://bower.io/) but you can also take the same browserified version from here:

- [qiskit.js](./qiskit.js): All components, [the same API that for node.js](../packages/qiskit/README.md). The global `qiskit` is exposed.
- [qiskit-qasm.js](./qiskit-qasm.js): Only the `qiskit-qasm` component, also [the same API that for node.js](../packages/qiskit-qasm/README.md). The global `qiskitQasm` is exposed in this case.

```sh
bower install qiskit
```

If you needed a new version of the bundled files, please run:

```sh
npm run bundle
```

## Use

Visit this [this one](./example.html) to see the JS version in action. You can use next command for a quick run:

```sh
npm run browser
```
