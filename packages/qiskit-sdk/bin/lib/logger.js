/*
  Copyright IBM Research Emergent Solutions
            Jesús Pérez <jesusprubio@gmail.com>

  This code may only be used under the MIT license found at
  https://opensource.org/licenses/MIT.
*/

'use strict';

const clc = require('cli-color');
const keypress = require('keypress');
const prettyjson = require('prettyjson');
const emoji = require('node-emoji');
const utils = require('./utils');

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

module.exports.chunks = (arr, chunkSize) => {
  if (!utils.isArray(arr)) {
    throw new Error('Bad format, array needed');
  }

  const chunks = utils.chunk(arr, chunkSize);
  let index = 0;
  const eventName = 'keypress';

  // Make `process.stdin` begin emitting "keypress" events.
  keypress(process.stdin);

  console.log(prettyjson.render(chunks[index]));
  index += 1;
  if (!chunks[index + 1]) {
    return;
  }

  console.log(
    clc.xterm(63)('\nPress ESC to finish or any other key to see more ...'),
  );

  // Listen for the event.
  process.stdin.on(eventName, (ch, key) => {
    // To allow ctrl+c
    if (key.ctrl && key.name === 'c') {
      process.stdin.pause();
    }

    if (key.name === 'escape' || !chunks[index + 1]) {
      process.stdin.pause();
    }

    console.log(prettyjson.render(chunks[index]));
    index += 1;
  });

  process.stdin.setRawMode(true);
  process.stdin.resume();
};

/* eslint-enable no-console */

module.exports.emoji = label => emoji.get(label);

module.exports.resultHead = () =>
  this.info(`\n${emoji.get('ok_hand')} Finised, result:`);
