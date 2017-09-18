# QISKit.js Quantum Experience

:atom_symbol: Quantum Information Software Kit library to use the [Quamtum Experience](https://quantumexperience.ng.bluemix.net).

Please visit the [main repository](https://github.ibm.com/IBMResearch/qiskit.js) of the project to know about the rest of the tools.

## Install

:coffee: Install [Node.js](https://nodejs.org/download) and then:

```sh
# Install (or upgrade) the module.
npm i -g IBMResearch/qiskit.js

# TODO: When published in npm.
# npm i -g qiskit-qe
```

## Use

:pencil: You can visit more advanced examples in the [test folder](test).

```js
const Qe = require('qiskit').Qe;
// TODO: When published to npm
// const Qe = require('qiskit-qe');

const qe = new Qe({});

console.log('Version');
console.log(qe.version);

await qe.login('YOUR_PERSONAL_TOKEN_HERE')

const backends = await qe.backends();
console.log(backends);
```

## API

:eyes: Full specification.

### `Qe(opts) -> qe`

The constructor accepts next option:

- `token` (string) - Long term access token, see next point.

### `token`

The long term access token being used, ie: to avoid the re-connection (login) in a worker.

- `token` (string) - Token.

### `version`

The actual version of the library.

- `version` (string) - Version number.

### `async login(personalToken) -> nfo`

Get a long term access token using the QE personal, you can get it [here](https://quantumexperience.ng.bluemix.net/qx/account).

- `info` (object): New token and its metadata:
  - `token` (string) - New long term access token.
  - `ttl` (number) - Time to live (in seconds).
  - `created` (string) - When the account was created.
  - `userId` (string)

### `async backends() -> info`

Get the information of all available backends.

- `info` ([object]): A list of objects with next fields:
  - `name` (string) - Descriptive name of the device.
  - `status` (string) - If it´s "on" or "off".
  - `serialNumber` (string)
  - `description` (string)
  - `id` (string)
  - `topologyId` (string)
  - `simulator` (boolean): To mark the simulators.
  - `nQubits` (number): Number of Qubits the device has.
  - `couplingMap` ([[number]]): To show how the Qubits are connected in this device.

### `async credits() -> info`

Get the information of all available backends.

- `info` (object): Including next fields:
  - promotional (number): Not rechargeable credits (one use), only through promotions.
  - remaining (number): Available credits. Automaticall recharged when the user executions has finished.
  - maxUserType (number): Max number of allowed credits for this type of user.
