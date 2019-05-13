# Qiskit.js algo (IBM Q)

[IBM Q](https://www.research.ibm.com/ibm-q) engine (chip and remote simulator) for the [Qiskit algorithms package](https://github.com/Qiskit/qiskit-js/tree/master/packages/qiskit-algo).

## Install

:coffee: Install lastest [Node.js](https://nodejs.org/download) stable version (or LTS) and then:

```sh
npm i @qiskit/algo-ibm
```

## Use

:pencil: You can visit the complete example [in this test](./test/functional.js).

```js
const Cloud = require('qiskit/cloud');
const qiskit = require('qiskit/algo-ibm');

const cloud = new Cloud();
cloud.login('YOUR_PERSONAL_TOKEN_HERE')
  .then(() => {
    cloud.backends()
      .then(data => {
        console.log('Backends:');
        console.log(data);
      });

    qiskit.random({
      custom: cloud,
      // default: simulator
      // engine: "ibmqx4"
    })
      .then(rand => console.log(`Random: ${rand}`))
  });
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
