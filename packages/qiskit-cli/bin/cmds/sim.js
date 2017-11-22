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
const utils = require('../lib/utils');
const logger = require('../lib/logger');


const dbg = utils.dbg(__filename);
const readFile = utils.promisify(fs.readFile);

exports.command = 'sim <circuit>';

exports.aliases = ['s'];

exports.desc = 'Simulate the circuit using the unitary simulator';

exports.builder = {
  circuit: {
    // Accepted options:
    // https://github.com/yargs/yargs/blob/master/docs/api.md#optionskey-opt
    desc: 'Path to the file with the code of the circuit. ' +
          'It supports OpenQASM (.qasm) or unrolled IR (.json)',
    type: 'string',
    normalize: true,
  },
};

exports.handler = (argv) => {
  logger.title(qiskit.version);

  dbg('Starting, args', argv);

  const extension = path.extname(argv.circuit);

  if (extension === '.qasm') {
    logger.error('Regular QASM circuits are still not supported' +
                ', please use the option "unrolled" with false for now');
    process.exit(1);
  }

  if (!extension || extension !== '.json') {
    logger.error('Format not supported');
    process.exit(1);
  }

  const pathCode = path.resolve(process.cwd(), argv.circuit);

  logger.info(`${logger.emoji('mag')} Reading the circuit file: ${pathCode}`);
  readFile(pathCode, 'utf8')
    .then((code) => {
      logger.info('Parsing the code file ...');

      let codeParsed;
      try {
        codeParsed = JSON.parse(code);
      } catch (err) {
        logger.error('Parsing the circuit file', err);
        process.exit(1);
      }

      logger.info(`\n${logger.emoji('computer')} Starting the simulation ...`);
      let resSim;
      logger.time();
      try {
        resSim = qiskit.sim.run(codeParsed);
        logger.timeEnd();
      } catch (err) {
        logger.error('Simulating the circuit', err);
        process.exit(1);
      }

      logger.resultHead();
      if (resSim && resSim.state) {
        const stateJson = resSim.state.toJSON();
        logger.bold(stateJson.data);

        logger.info('\nState |psi> = U|0>:');
        const state0 = qiskit.sim.state0(resSim.state);
        logger.bold(state0);

        logger.info('\nExtra info:');
        logger.json({ size: stateJson.size });
      }
    })
    .catch((err) => {
      logger.error('Reading the circuit file', err);
      process.exit(1);
    });
};
