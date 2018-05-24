/*
  Copyright IBM Research Emergent Solutions
            Jesús Pérez <jesusprubio@gmail.com>

  This code may only be used under the MIT license found at
  https://opensource.org/licenses/MIT.
*/

'use strict';

const util = require('util');

const prompt = require('prompt');

const qiskit = require('../..');
const logger = require('../lib/logger');
const storage = require('../lib/storage');

const getToken = util.promisify(prompt.get);
const promptSchema = {
  properties: {
    apiToken: {
      type: 'string',
      hidden: true,
      message:
        'Quantum Experience API token, you can get' +
        ' it here: https://quantumexperience.ng.bluemix.net/qx/account/advanced',
      required: true,
    },
  },
};

exports.command = 'cloud-login [printToken]';

exports.aliases = ['cl'];

exports.desc = 'Get a long term access token';

exports.builder = {
  printToken: {
    desc: 'To show the returned long term token in the console',
    type: 'boolean',
    default: false,
  },
};

exports.handler = argv => {
  logger.title(qiskit.version);

  prompt.start();
  getToken(promptSchema)
    .then(entered => {
      global.qiskit.cloud
        .login(entered.apiToken)
        .then(res => {
          logger.resultHead();

          storage
            .setItem('token', res.token)
            .then(() => {
              if (!argv.printToken) {
                delete res.token;
              }

              logger.json(res);
              logger.regular(
                '\nLong term token correctly stored for future uses',
              );
            })
            .catch(err => {
              logger.error('Storing the new long term token', err);
              process.exit(1);
            });
        })
        .catch(err => {
          logger.error('Making the request', err);
          process.exit(1);
        });
    })
    .catch(err => {
      logger.error('Prompting for the personal token', err);
      process.exit(1);
    });
};
