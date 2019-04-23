# Qiskit.js devs (pure JavaScript)

Pure JS engine ([jsqubits](https://www.npmjs.com/package/jsqubits) based) engine (simulator) for the [Qiskit algorithms package](https://github.com/Qiskit/qiskit-js/tree/master/packages/qiskit-devs).

## Install

:coffee: Install lastest [Node.js](https://nodejs.org/download) stable version (or LTS) and then:

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

:eyes: Please check the [main doc](../../README.md#API). The methods signature is the same but:

* As expected, the `engine` parameter is omitted here.
* All algorithms doesn't need a background job, so a result is returned (vs a `jobId`).
