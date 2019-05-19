# Qiskit.js algo (ANU)

The [Australian National University](http://www.anu.edu.au) [Quantum Random Numbers Server](https://qrng.anu.edu.au) engine (chip) for the [Qiskit algorithms package](https://github.com/Qiskit/qiskit-js/tree/master/packages/qiskit-algo).

## Install

:coffee: Install lastest [Node.js](https://nodejs.org/download) stable version (or LTS) and then:

```sh
npm i @qiskit/algo-anu
```

## Use

:pencil: You can visit the complete example [in this test](./test/functional.js).

```js
const qiskit = require('@qiskit/algo-anu');

console.log('Version');
console.log(qiskit.version);
```

## API

:eyes: Please check the [main doc](../../README.md#API). The methods signature is the same but:

* As expected, the `engine` parameter is omitted here.
* Only the `random` method is supported.
