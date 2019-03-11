/**
 * @license
 *
 * Copyright (c) 2017, IBM.
 *
 * This source code is licensed under the Apache License, Version 2.0 found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');

const qiskit = require('../..');
const logger = require('../lib/logger');

const readFile = util.promisify(fs.readFile);

exports.command =
  'circuit <circuit> [backend] [shots] [name] [seed] [maxCredits]';

exports.aliases = ['ci'];

exports.desc =
  'Send the circuit to be run in the Quantum Experience' +
  ' (https://quantumexperience.ng.bluemix.net)';

exports.builder = {
  circuit: {
    desc: 'Path to the file with the code of the circuit (OpenQASM)',
    type: 'string',
    normalize: true,
  },
  backend: {
    desc: 'Name of the backend to use',
    type: 'string',
    default: 'simulator',
  },
  shots: {
    desc: 'Number of times to run the circuit',
    type: 'string',
    default: 1,
  },
  name: {
    desc: 'Human friendly indetifier',
    type: 'string',
  },
  seed: {
    desc: 'Noise entropy, only allowed if using the simulator',
    type: 'string',
  },
  maxCredits: {
    desc: 'Number of times to run the circuit',
    type: 'number',
  },
};

exports.handler = argv => {
  logger.title(qiskit.version);

  const extension = path.extname(argv.circuit);

  if (!extension || extension !== '.qasm') {
    logger.error('Format not supported');
    process.exit(1);
  }

  const pathCode = path.resolve(process.cwd(), argv.circuit);

  logger.info(`${logger.emoji('mag')} Reading the circuit file: ${pathCode}`);
  readFile(pathCode, 'utf8')
    .then(code => {
      global.qiskit.cloud
        .run(
          code,
          argv.backend,
          argv.shots,
          argv.name,
          argv.seed,
          argv.maxCredits,
        )
        .then(res => {
          logger.resultHead();
          logger.json(res);
        })
        .catch(err => {
          logger.error('Making the request', err);
          process.exit(1);
        });
    })
    .catch(err => {
      logger.error('Reading the circuit file', err);
      process.exit(1);
    });
};
