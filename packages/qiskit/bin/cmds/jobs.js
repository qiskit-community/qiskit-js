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

exports.command = 'jobs [limit] [offset]';

exports.aliases = ['js'];

exports.desc = 'Get all your jobs. Ordered by creation date';

exports.builder = {
  limit: {
    desc: ' To get only info of the simulators',
    type: 'number',
    default: 50,
  },
  offset: {
    desc: ' To get only info of the simulators',
    type: 'number',
  },
};

exports.handler = argv => {
  logger.title(qiskit.version);

  global.qiskit.cloud
    .jobs(argv.limit, argv.offset)
    .then(res => {
      logger.resultHead();

      utils.forEach(res, data => {
        let header = `${data.id}`;
        if (data.name) {
          header = `${header} (${data.name})`;
        }

        /* eslint-disable no-param-reassign */
        delete data.id;
        delete data.name;
        data.circuits = data.circuits.length;
        /* eslint-enable no-param-reassign */

        logger.bold(`\n${header}`);
        logger.json(data);
      });
    })
    .catch(err => {
      logger.error('Making the request', err);
      process.exit(1);
    });
};
