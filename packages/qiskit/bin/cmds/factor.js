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

exports.command = 'factor <number>';

exports.aliases = ['f'];

exports.desc = 'Calculate a factor of a number';

exports.builder = {
  number: {
    desc: 'Number to factorize',
    type: 'number',
  },
};

exports.handler = argv => {
  logger.title(qiskit.version);

  qiskit.algo
    .factor(argv.number)
    .then(res => {
      logger.resultHead();
      logger.json(res);
    })
    .catch(err => {
      logger.error('Making the request', err);
      process.exit(1);
    });
};
