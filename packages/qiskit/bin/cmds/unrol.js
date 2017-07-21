/*
  Copyright IBM Research Emergent Solutions
            Jesús Pérez <jesusprubio@gmail.com>

  This code may only be used under the MIT license found at
  https://opensource.org/licenses/MIT.
*/

'use strict';

const path = require('path');

const qiskit = require('../..');
const utils = require('../utils');
const logger = require('../logger');


const dbg = utils.dbg(__filename);


exports.command = 'unroll <circuit>';

exports.aliases = ['u'];

exports.desc = 'Extend the circuit with the unitary simulator unroller';

exports.builder = {
  circuit: {
    desc: 'Path to the file with the code of the circuit',
    type: 'string',
    normalize: true,
  },
};


exports.handler = (argv) => {
  logger.title(qiskit.version);

  dbg('Starting, args', argv);

  const pathCode = path.resolve(process.cwd(), argv.circuit);

  utils.readFile(pathCode, 'utf8')
  .then((code) => { logger.json(qiskit.sim.unroll(code)); })
  .catch((err) => {
    logger.error('Reading the circuit file', err);
    process.exit(1);
  });
};
