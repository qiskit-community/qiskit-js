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

exports.command = 'job <id>';

exports.aliases = ['j'];

exports.desc = 'Get the info of a specific job';

exports.builder = {
  id: {
    desc: 'Job identifier',
    type: 'string',
  },
};

exports.handler = argv => {
  logger.title(qiskit.version);

  global.qiskit.cloud
    .job(argv.id)
    .then(res => {
      logger.resultHead();
      logger.json(res);
    })
    .catch(err => {
      logger.error('Making the request', err);
      process.exit(1);
    });
};
