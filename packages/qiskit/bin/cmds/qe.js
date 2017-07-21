/*
  Copyright IBM Research Emergent Solutions
            Jesús Pérez <jesusprubio@gmail.com>

  This code may only be used under the MIT license found at
  https://opensource.org/licenses/MIT.
*/

'use strict';

const qiskit = require('../..');
const logger = require('../logger');


exports.command = 'qe <circuit> <key>';

exports.aliases = ['q'];

exports.desc = 'Send the circuit to the Quantum Experience' +
                   ' (https://quantumexperience.ng.bluemix.net)';

exports.builder = {
  circuit: {
    desc: 'Path to the file with the code of the circuit',
    type: 'string',
    normalize: true,
  },
  key: { describe: 'Your QE API key' },
};

// exports.handler = (argv) => {
exports.handler = () => {
  logger.title(qiskit.version);
  logger.error('Coming soon, please use the local simulator for now');
};
