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
const utils = require('../lib/utils');

exports.command = 'backends [onlySims]';

exports.aliases = ['bs'];

exports.desc = 'Get latest calibration stats for a backend';

exports.builder = {
  onlySims: {
    desc: ' To get only info of the simulators',
    type: 'boolean',
    default: false,
  },
};

exports.handler = argv => {
  logger.title(qiskit.version);

  global.qiskit.cloud
    .backends(argv.onlySims)
    .then(res => {
      logger.resultHead();

      utils.forEach(res, data => {
        let header = `${data.name}`;
        if (data.chipName) {
          header = `${header} (${data.chipName}, v${data.version})`;
        }
        logger.bold(`\n${header}`);
        logger.regular(
          `simulator: ${data.simulator} nQubits: ${data.nQubits} status: ${
            data.status
          }`,
        );
      });
    })
    .catch(err => {
      logger.error('Making the request', err);
      process.exit(1);
    });
};
