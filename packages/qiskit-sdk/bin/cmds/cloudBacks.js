/*
  Copyright IBM Research Emergent Solutions
            Jesús Pérez <jesusprubio@gmail.com>

  This code may only be used under the MIT license found at
  https://opensource.org/licenses/MIT.
*/

'use strict';

const qiskit = require('../..');
const logger = require('../lib/logger');

exports.command = 'cloud-backs [onlySims]';

exports.aliases = ['cbs'];

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
      logger.chunks(res);
    })
    .catch(err => {
      logger.error('Making the request', err);
      process.exit(1);
    });
};
