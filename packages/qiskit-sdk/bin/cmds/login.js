/**
 * @license
 *
 * Copyright (c) 2017, IBM.
 *
 * This source code is licensed under the Apache License, Version 2.0 found in
 * the LICENSE.txt file in the root directory of this source tree.
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
    apiKey: {
      type: 'string',
      hidden: true,
      message:
        'Quantum Experience API key, you can get' +
        ' it here: https://quantumexperience.ng.bluemix.net/qx/account/advanced',
      required: true,
    },
  },
};

exports.command = 'login [printToken]';

exports.aliases = ['l'];

exports.desc = 'Use an API key to get a token to make requests';

exports.builder = {
  printToken: {
    desc: 'To show the returned API auth token in the console',
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
        .login(entered.apiKey)
        .then(res => {
          logger.resultHead();

          Promise.all([
            storage.setItem('token', res.token),
            storage.setItem('userId', res.userId),
          ])
            .then(() => {
              if (!argv.printToken) {
                delete res.token;
              }

              logger.json(res);
              logger.regular(
                '\nHTTP API auth token and user ID correctly stored for future use',
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
