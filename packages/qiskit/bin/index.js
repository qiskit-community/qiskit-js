#!/usr/bin/env node

/*
  Copyright IBM Research Emergent Solutions
            Jesús Pérez <jesusprubio@gmail.com>

  This code may only be used under the MIT license found at
  https://opensource.org/licenses/MIT.
*/

'use strict';


const yargs = require('yargs');

// const qiskit = require('..');


// eslint-disable-next-line no-unused-expressions
yargs
  // TODO: Not needed in v9, confirms
  // .version(qiskit.version)
  .commandDir('./cmds')
  .demandCommand()
  // TODO: Not needed in v9, confirms
  // .help()
  .argv;
