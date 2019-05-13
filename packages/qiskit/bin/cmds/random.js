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

exports.command = 'random [engine] [length] [format] [backend]';

exports.aliases = ['r'];

exports.desc = 'Generate a true random number among 0 and 1';

exports.builder = {
  engine: {
    desc: 'Where to run the operation. Supported: "js", "ibm"',
    type: 'string',
    default: 'js',
  },
  length: {
    desc:
      'Number of random hex characters to ask for to the engine. ' +
      "As you can see in the doc referenced before each engine has different limit, they will throw in it's overpassed",
    type: 'number',
    default: 16,
  },
  format: {
    desc: 'To ask for the result in a different format, supported ("hex")',
    type: 'string',
    default: null,
  },
  backend: {
    desc: 'Name of the IBM backend to use (if any)',
    type: 'string',
    default: 'simulator',
  },
};

exports.handler = argv => {
  logger.title(qiskit.version);

  const opts = {
    engine: argv.engine || 'js',
    length: argv.length,
    format: argv.format,
    backend: argv.backend,
  };

  if (argv.engine && argv.engine === 'ibm') {
    opts.custom = global.qiskit.cloud;
  }

  qiskit.algo
    .random(opts)
    .then(res => {
      logger.resultHead();
      logger.json(res);
    })
    .catch(err => {
      logger.error('Making the request', err);
      process.exit(1);
    });
};
