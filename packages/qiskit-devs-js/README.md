# QISKit.js algorithms (pure JavaScript)

Pure JS engine ([jsqubitjs](https://www.research.ibm.com/ibm-q) based) engine (simulator) for the [QISKit algorithms package](https://github.com/QISKit/qiskit-js/tree/master/packages/qiskit-devs).

## Install

:coffee: Install [Node.js](https://nodejs.org/download) v8 and then:

```sh
npm i @qiskit/devs-js
```

## Use

:pencil: You can visit the complete example [in this test](test/functional.js).

```js
const qiskit = require('@qiskit/devs-js');

console.log('Version');
console.log(qiskit.version);
```

## API

:eyes: Please check the [main doc](../../README.md#API). The method signature is the same but:

* As expected, the `engine` parameter is omitted here.
* All algorithms doesn't need a background job, so a result is returned (vs a `jobId`).
