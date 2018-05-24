#!/usr/bin/env node

/*
  Copyright IBM Research Emergent Solutions
            Jesús Pérez <jesusprubio@gmail.com>

  This code may only be used under the MIT license found at
  https://opensource.org/licenses/MIT.
*/

'use strict';

const yargs = require('yargs');

const qiskit = require('..');
const logger = require('./lib/logger');
const storage = require('./lib/storage');

// To share it among the different QE related commands.
global.qiskit = { qe: new qiskit.Qe() };

storage
  .getItem('token')
  .then(token => {
    if (token) {
      global.qiskit.qe.token = token;
    }

    // Starting the console cli.
    // eslint-disable-next-line no-unused-expressions
    yargs.commandDir('./cmds').demandCommand().argv;
  })
  .catch(err => {
    logger.error('Looking for a long term token', err);
    process.exit(1);
  });
