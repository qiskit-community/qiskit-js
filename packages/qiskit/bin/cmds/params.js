/**
 * @license
 *
 * Copyright (c) 2017, IBM.
 *
 * This source code is licensed under the Apache License, Version 2.0 found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const qiskit = require('../..');
const logger = require('../lib/logger');

exports.command = 'params [backend]';

exports.aliases = ['p'];

exports.desc = 'Get latest parameter stats for a backend';

exports.builder = {
  backend: {
    desc: 'Name of the backend to inspect',
    type: 'string',
    default: 'ibmqx4',
  },
};

exports.handler = argv => {
  logger.title(qiskit.version);

  global.qiskit.cloud
    .parameters(argv.backend)
    .then(res => {
      logger.resultHead();
      logger.json(res);
    })
    .catch(err => {
      logger.error('Making the request', err);
      process.exit(1);
    });
};
