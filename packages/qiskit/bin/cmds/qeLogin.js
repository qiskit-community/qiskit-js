/*
  Copyright IBM Research Emergent Solutions
            Jesús Pérez <jesusprubio@gmail.com>

  This code may only be used under the MIT license found at
  https://opensource.org/licenses/MIT.
*/

'use strict';

const qiskit = require('../..');
const logger = require('../lib/logger');
const storage = require('../lib/storage');


exports.command = 'qe-login <token>';

exports.aliases = ['ql'];

exports.desc = 'Get a long term access token';

exports.builder = {
  // TODO: Use this to ask for it: (to avoid showing the pasted token)
  // https://www.npmjs.com/package/prompt
  token: {
    desc: 'Quantum Experience personal token, you can get' +
          ' it here: https://quantumexperience.ng.bluemix.net/qx/account',
    type: 'string',
  },
  printToken: {
    desc: 'To show the returned long term token in the console',
    type: 'boolean',
    default: false,
  },
};


exports.handler = (argv) => {
  logger.title(qiskit.version);

  global.qiskit.qe.login(argv.token)
    .then((res) => {
      logger.resultHead();

      if (!argv.printToken) { delete res.token; }

      logger.json(res);

      storage.setItem('token', res.token)
        .then(() => {
          logger.regular('\nLong term token correctly stored for future uses');
        })
        .catch((err) => {
          logger.error('Storing the new long term token', err);
          process.exit(1);
        });
    })
    .catch((err) => {
      logger.error('Making the request', err);
      process.exit(1);
    });
};
