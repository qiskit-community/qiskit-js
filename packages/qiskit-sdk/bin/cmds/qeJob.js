/*
  Copyright IBM Research Emergent Solutions
            Jesús Pérez <jesusprubio@gmail.com>

  This code may only be used under the MIT license found at
  https://opensource.org/licenses/MIT.
*/

'use strict';

const qiskit = require('../..');
const logger = require('../lib/logger');

exports.command = 'qe-job <id>';

exports.aliases = ['qj'];

exports.desc = 'Get the info of a specific job';

exports.builder = {
  id: {
    desc: 'Job identifier',
    type: 'string',
  },
};

exports.handler = argv => {
  logger.title(qiskit.version);

  global.qiskit.qe
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
