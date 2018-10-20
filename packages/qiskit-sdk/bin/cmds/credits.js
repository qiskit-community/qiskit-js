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

exports.command = 'credits';

exports.aliases = ['cr'];

exports.desc = 'Information about your credits';

exports.builder = {};

exports.handler = () => {
  logger.title(qiskit.version);

  global.qiskit.cloud
    .credits()
    .then(res => {
      logger.resultHead();
      logger.json(res);
    })
    .catch(err => {
      logger.error('Making the request', err);
      process.exit(1);
    });
};
