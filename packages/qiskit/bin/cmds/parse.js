/*
  Copyright IBM Research Emergent Solutions
            Jesús Pérez <jesusprubio@gmail.com>

  This code may only be used under the MIT license found at
  https://opensource.org/licenses/MIT.
*/

'use strict';

const fs = require('fs');
const path = require('path');

const qiskit = require('../..');
const utils = require('../utils');
const logger = require('../logger');

const readFile = utils.promisify(fs.readFile);
const dbg = utils.dbg(__filename);


exports.command = 'parse <circuit>';

exports.aliases = ['p'];

exports.desc = 'Parse the circuit to our intermediate JSON format';

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

  // TODO: "async" still not suported by yargs:
  // https://github.com/yargs/yargs/issues/510
  readFile(pathCode, 'utf8')
  .then((code) => { logger.json(qiskit.qasm.parse(code)); })
  .catch((err) => {
    logger.error('Reading the circuit file', err);
    process.exit(1);
  });
};
