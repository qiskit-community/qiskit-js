# QISKit.js for the browser

:atom_symbol: Quantum Information Science Kit for the browser.

Please visit the [main repository](https://github.com/QISKit/qiskit-js) of the project to know about the rest of the tools.

## Install

:inbox_tray: You can take the same browserified version from here:

- [qiskit-qasm.js](./qiskit-qasm.js): Only the `@qiskit/qasm` component, also [the same API that for node.js](../packages/qiskit-qasm/README.md). The global `qiskitQasm` is exposed.
- [qiskit-cloud.js](./qiskit-cloud.js): The same for the `@qiskit/cloud` component, also [the same API](../packages/qiskit-cloud/README.md) and the global is `QiskitQe`.
- [qiskit-sim.js](./qiskit-sim.js): The same for the `@qiskit/sim` component, also [the same API](../packages/qiskit-sim/README.md) and the global is `qiskitSim`.

If you needed a new version of the bundled files, please run:

```sh
npm run bundle
```

## Use

Visit this [this one](./example.html) to see the JS version in action. You can use next command for a quick run:

```sh
npm run browser
```
