/*
  Copyright IBM Research Emergent Solutions
            Jesús Pérez <jesusprubio@gmail.com>

  This code may only be used under the MIT license found at
  https://opensource.org/licenses/MIT.
*/

'use strict';

const qiskit = require('../..');
const logger = require('../lib/logger');

exports.command = 'cloud-jobs [limit] [offset]';

exports.aliases = ['cjs'];

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
      logger.chunks(res);
    })
    .catch(err => {
      logger.error('Making the request', err);
      process.exit(1);
    });
};
