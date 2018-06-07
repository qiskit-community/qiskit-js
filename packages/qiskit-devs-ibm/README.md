# QISKit.js algorithms (IBM Q)

[IBM Q](https://www.research.ibm.com/ibm-q) engine (chip and remote simulator) for the [QISKit algorithms package](https://github.com/QISKit/qiskit-js/tree/master/packages/qiskit-devs).

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

* As expected, the `engine` parameter is omitted here.
* All algorithms need a background job, so a `jobId` is returned.
* The `token` parameter is mandatory. Provided by the `login` method of the [qiskit-cloud](../qiskit-cloud) package.
* An extra one `userId` is also needed, same that for the last option.
