# Qiskit.js devs (IBM Q)

[IBM Q](https://www.research.ibm.com/ibm-q) engine (chip and remote simulator) for the [Qiskit devs package](https://github.com/Qiskit/qiskit-js/tree/master/packages/qiskit-devs).

## Install

:coffee: Install [Node.js](https://nodejs.org/download) v8 and then:

```sh
npm i @qiskit/devs-ibm
```

## Use

:pencil: You can visit the complete example [in this test](./test/functional/index.js).

```js
const qiskit = require('@qiskit/devs-ibm');

console.log('Version');
console.log(qiskit.version);
```

## API

:eyes: Please check the [main doc](../../README.md#API). The method signature is the same but:

- As expected, the `engine` parameter is omitted here.
- All algorithms need a background job, so a `jobId` is returned.
- About the options:
  - `custom` (object): Mandatory here, it should be a logged [qiskit-cloud](../qiskit-cloud) instance.
  - `backend` (string): Name of the backend to use. (default: simulator)
  - `shots` (number): Number of times to run the circuit. (default: 1)
  - `maxCredits` (number): Max number of the credits to run this job. The task will be cancelled if it needs more.
