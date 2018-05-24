/*
  Copyright IBM Research Emergent Solutions
            Jesús Pérez <jesusprubio@gmail.com>

  This code may only be used under the MIT license found at
  https://opensource.org/licenses/MIT.
*/

'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');

const qiskit = require('../..');
const utils = require('../lib/utils');
const logger = require('../lib/logger');

const readFile = util.promisify(fs.readFile);
const dbg = utils.dbg(__filename);

exports.command = 'parse <circuit>';

exports.aliases = ['p'];

// TODO: Put a name to our IR.
exports.desc =
  'Parse the circuit to our IR (intermediate representation - JSON format).';

exports.builder = {
  circuit: {
    desc: 'Path to the file with the code of the circuit (OpenQASM)',
    type: 'string',
    normalize: true,
  },
};

exports.handler = argv => {
  logger.title(qiskit.version);
  logger.bold('\n\nWARNING: Partial implementetation for now\n\n');

  dbg('Starting, args', argv);

  const pathCode = path.resolve(process.cwd(), argv.circuit);
  const parser = new qiskit.qasm.Parser();

  // TODO: "async" still not suported by yargs:
  // https://github.com/yargs/yargs/issues/510
  readFile(pathCode, 'utf8')
    .then(code => {
      try {
        logger.resultHead();
        logger.json(parser.parse(code));
      } catch (err) {
        logger.error('Parsing the circuit', err);
        process.exit(1);
      }
    })
    .catch(err => {
      logger.error('Reading the circuit file', err);
      process.exit(1);
    });
};
