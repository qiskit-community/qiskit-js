# QISKit.js algorithms (ANU)

The [Australian National University](http://www.anu.edu.au) [Quantum Random Numbers Server](https://qrng.anu.edu.au) engine (chip) for the [QISKit algorithms package](https://github.com/QISKit/qiskit-js/tree/master/packages/qiskit-devs).

## Install

:coffee: Install [Node.js](https://nodejs.org/download) v8 and then:

```sh
npm i @qiskit/devs-anu
```

## Use

:pencil: You can visit the complete example [in this test](./test/functional/index.js).

```js
const qiskit = require('@qiskit/devs-anu');

console.log('Version');
console.log(qiskit.version);
```

## API

:eyes: Please check the [main doc](../../README.md#API). The methods signature is the same but:

* As expected, the `engine` parameter is omitted here.
* Only the `random` method is supported.
