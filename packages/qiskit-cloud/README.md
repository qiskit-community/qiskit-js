# Qiskit.js cloud

:atom_symbol: Quantum Information Science Kit library to use the [Quamtum Experience](https://quantumexperience.ng.bluemix.net).

Please visit the [main repository](https://github.com/Qiskit/qiskit-js) of the project to know about the rest of the tools.

## Install

:coffee: Install lastest [Node.js](https://nodejs.org/download) stable version (or LTS) and then:

```sh
npm i @qiskit/cloud
```

## Use

:pencil: You can visit more advanced examples in the [test folder](test).

```js
'use strict';

const Cloud = require('@qiskit/cloud');

const cloud = new Cloud();

console.log('Version');
console.log(cloud.version);

cloud
  .login('YOUR_PERSONAL_TOKEN_HERE')
  .then(() => cloud.backends())
  .then(backs => console.log(backs));
```

## API

:eyes: Full specification.

### `Cloud(opts) -> cloud`

The constructor accepts next options:

- `token` (string) - Long term access token, see next point.
- `cloud` (object) - New instance.

### `token`

To force the long term access token, ie: to avoid the re-connection (login) in a worker.

- `token` (string) - Token.

### `userId`

To force user idendifier, ie: to avoid the re-connection (login) in a worker.

- `userId` (string) - User identifier.

### `version`

The actual version of the library.

- `version` (string) - Version number.

### `async calibration(name) -> info`

Get latest calibration stats for a backend.

- `name` (string): Name of the backend to inspect. (default: `ibmqx4`)
- `info` (object): Including next fields:
  - `lastUpdateDate` (string): Date of the last read.
  - `qubits` ([object]): Error in each qubit.
  - `multiQubitGates:` ([object]): Error in each gate.

### `async parameters(name) -> info`

Get the latest parameters stats of the backend (more recent values that the ones returned by the `backendCalibration` method).

- `name` (string): Name of the backend to inspect. (default: `ibmqx4`)
- `info` (object): Including next fields:
  - `lastUpdateDate` (string): Date of the last read.
  - `fridgeParameters` (string): Information about the cooler.
  - `qubits` ([object]): Error in each qubit.

### `async queues(name) -> info`

Get the status of a backend queue.

- `name` (string): Name of the backend to inspect. (default: `ibmqx4`)
- `info` (object): Including next fields:
  - `state` (boolean): If the queue is up or down.
  - `status` (string): Actual status of the devices, ie: "busy", "calibration", etc.
  - `lengthQueue` (number): Number of jobs in the queue.

### `async login(apiKey) -> info`

To authenticate yourself. **This method should be called before the rest ones documented from this point**.

- `apiKey` (string): QE API key, you can get it [here](https://quantumexperience.ng.bluemix.net/qx/account).
- `info` (object): New token and its metadata:
  - `token` (string) - HTTP API authentication token.
  - `ttl` (number) - Time to live (in seconds).
  - `created` (string) - When the account was created.
  - `userId` (string).

### `async backend(name) -> info`

Get the information of one the chips or simulator.

- `name` (string): Name of the backend to inspect. (default: `ibmqx4`)
- `info` ([object]): An object with next fields:
  - `name` (string) - Descriptive name of the device.
  - `status` (string) - If it´s "on" or "off".
  - `serialNumber` (string)
  - `description` (string)
  - `id` (string)
  - `topologyId` (string)
  - `simulator` (boolean): To mark the simulators.
  - `nQubits` (number): Number of Qubits the device has.
  - `couplingMap` ([[number]]): To show how the Qubits are connected in this device.

### `async backends(onlySims) -> infos`

Get the information of all available chips and simulators.

- `onlySims` (boolean): To get only info of the simulators. (default: false)
- `infos` ([object]): A list of "info" objects (see last method).

### `async run(circuit, opts) -> info`

Run a circuit in any of the avaliable backends. This method generates a new execution.

- `circuit` (string): Circuit in OpenQASM.
- `opts` (object): With next fields:
  - `backend` (string): Name of the backend to use. (default: simulator)
  - `shots` (number): Number of times to run the circuit. (default: 1)
  - `name` (string): Human friendly indetifier.
  - `seed` (string): Noise entropy, only allowed if using the simulator.
  - `maxCredits` (number): Max number of the credits to run this job. The task will be cancelled if it needs more.
- `info` (object): Including next fields:
  - `id` (string): Unique identifier for the job created to run this circuit.
  - `status` (string): To know if the complete job has finished. Supported: "RUNNING", "ERROR_CREATING_JOB", "ERROR_RUNNING_JOB" or "COMPLETED".
  - `name` (string): Passed (or generated) human friendly indetifier.

### `async runBatch(circuits, opts) -> infos`

Run a batch of circuits in any of the avaliable backends. This method can generate multiple executions. _Note: For convenience the descriptions not included are the same that for last method_

- `circuits` ([object]): Batch of circuits. Being "object":
  - `qasm` (string): Circuit in OpenQASM. The unique mandatory field.
  - `name`
  - `shots`: Only to overwrite this parameter defined in "opts" for this piece of code.
  - `seed`: Same than "shots".
- `opts`
  - `backend`
  - `shots`
  - `seed`
  - `maxCredits`
- `infos` ([object]): Including next fields:
  - `id`
  - `status`

### `async job(id) -> info`

Get the info of a specific job.

- `id` (string): Job identifier.
- `info` (object): Including next fields:
  - `id` (string): Unique identifier for the job.
  - `backend` (string): Passed name of the backend to use.
  - `shots` (number): Passed number of times to run the circuit.
  - `creationDate` (string): When the job has entered into the system.
  - `usedCredits` (number): Number of consumed credits by the run.
  - `status` (string): To know if the complete job has finished. Supported: "RUNNING", "ERROR_CREATING_JOB", "ERROR_RUNNING_JOB" or "COMPLETED".
  - `maxCredits` (number): Max number passed of credits to use in this run before cancel it.
  - `circuits` ([object]): Batch of circuits. Being "object":
    - `qasm` (string): Passed circuit.
    - `name` (string): Passed (or generated) human friendly indetifier.
    - `shots` (number): If the parameter defined in "opts" was overwritten.
    - `seed` (string): If the parameter defined in "opts" was overwritten.
    - `execution` (object): Generated execution info, with these fields:
      - `id` (string): Identifier of the execution of this program.
      - `status` (string): Status of this execution of the program. Supported: "WORKING_IN_PROGRESS", "DONE", "ERROR", "NOT_APPROVED".
      - `result` (object): Present only when the job has finished.
        - `date` (string): When the job finished.
        - `data` (object):
          - `time` (number): How long it took, in seconds.
          - `count` (object): For each shot (value/key pair) the keys represent the final state of the qubits, and the value their probability. ie: { "00000": 189, "00001": 10 }

### `async jobs(limit, skip) -> infos`

Get all your jobs. Ordered by creation date.

- `limit` (number): Limit the number of instances to return. (default: 50)
- `offset` (number): Skip the specified number of instances. Use it with "limit" to implement result pagination.
- `infos` ([object]): The info for the required jobs. The object structure is like the one returned by the method `job`.

## `async credits() -> info`

Get info about your account credits.

- `info` (object): Including next fields:
  - `remaining` (number): Number of them the user still hasn't consumed.
  - `maxUserType` (number): Limit of max allowed for this type of user (out of promotion).
