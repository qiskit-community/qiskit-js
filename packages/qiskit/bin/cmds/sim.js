/*
  Copyright IBM Research Emergent Solutions
            Jesús Pérez <jesusprubio@gmail.com>

  This code may only be used under the MIT license found at
  https://opensource.org/licenses/MIT.
*/

'use strict';

const path = require('path');

const math = require('mathjs');

const qiskit = require('../..');
const utils = require('../utils');
const logger = require('../logger');

const dbg = utils.dbg(__filename);


exports.command = 'sim <circuit> [unrolled]';

exports.aliases = ['s'];

exports.desc = 'Simulate the circuit using the unitary simulator';

exports.builder = {
  circuit: {
    // Accepted options:
    // https://github.com/yargs/yargs/blob/master/docs/api.md#optionskey-opt
    desc: 'Path to the file with the code of the circuit',
    type: 'string',
    normalize: true,
  },
  unrolled: {
    default: false,
    desc: 'The passed circuit is already unrolled',
    type: 'boolean',
  },
};

exports.handler = (argv) => {
  logger.title(qiskit.version);

  dbg('Starting, args', argv);

  if (!argv.unrolled) {
    logger.error('Regular QASM circuits are still not supported' +
                ', please use the option "unrolled" with false for now');
    process.exit(1);
  }

  const pathCode = path.resolve(process.cwd(), argv.circuit);

  logger.info(`${logger.emoji('mag')} Reading the circuit file: ${pathCode}`);
  utils.readFile(pathCode, 'utf8')
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
    logger.time();
    const resSim = qiskit.sim.run(codeParsed);
    logger.timeEnd();

    logger.info(`\n${logger.emoji('ok_hand')} Finised, result:`);
    if (resSim && resSim.state) {
      const stateJson = resSim.state.toJSON();
      logger.bold(stateJson.data);
      logger.info('\nState |psi> = U|0>:');
      const quantumState = math.chain(math.zeros(stateJson.size[0]))
                                .multiply(math.complex(1, 0))
                                .done();
      quantumState.set([0], 1);

      logger.bold(math.multiply(resSim.state, quantumState));
      logger.info('\nExtra info:');
      logger.json({ size: stateJson.size });
    }
  })
  .catch((err) => {
    logger.error('Reading the circuit file', err);
    process.exit(1);
  });
};
