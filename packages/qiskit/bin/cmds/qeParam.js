/*
  Copyright IBM Research Emergent Solutions
            Jesús Pérez <jesusprubio@gmail.com>

  This code may only be used under the MIT license found at
  https://opensource.org/licenses/MIT.
*/

'use strict';

const qiskit = require('../..');
const logger = require('../lib/logger');


exports.command = 'qe-params [backend]';

exports.aliases = ['qp'];

exports.desc = 'Get latest parameter stats for a backend';

exports.builder = {
  backend: {
    desc: 'Name of the backend to inspect',
    type: 'string',
    default: 'ibmqx4',
  },
};


exports.handler = (argv) => {
  logger.title(qiskit.version);

  global.qiskit.qe.parameters(argv.backend)
    .then((res) => {
      logger.resultHead();
      logger.json(res);
    })
    .catch((err) => {
      logger.error('Making the request', err);
      process.exit(1);
    });
};
