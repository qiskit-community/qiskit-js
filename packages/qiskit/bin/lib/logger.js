/**
 * @license
 *
 * Copyright (c) 2017, IBM.
 *
 * This source code is licensed under the Apache License, Version 2.0 found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const clc = require('cli-color');
const prettyjson = require('prettyjson');
const emoji = require('node-emoji');

/* eslint-disable no-console */

module.exports.info = str => console.log(clc.xterm(63)(str));

module.exports.json = json => console.log(prettyjson.render(json));

module.exports.error = (str, err) => {
  console.error(clc.red(str));
  if (err && err.stack) {
    console.error(clc.red(err.stack));
  }
};

module.exports.regular = str => console.log(str);

module.exports.bold = str => console.log(clc.bold(str));

module.exports.title = version => {
  console.log(clc.bold.xterm(202)(`\n\tqiskit.js ${emoji.get('atom_symbol')}`));
  console.log(clc.xterm(63)(`\t(v${version})\n`));
};

module.exports.time = label => console.time(clc.xterm(63)(label));

module.exports.timeEnd = label => console.timeEnd(clc.xterm(63)(label));
/* eslint-enable no-console */

module.exports.emoji = label => emoji.get(label);

module.exports.resultHead = () =>
  this.info(`\n${emoji.get('ok_hand')} Finised, result:`);
