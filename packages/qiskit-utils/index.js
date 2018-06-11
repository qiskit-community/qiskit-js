/**
 * @license
 *
 * Copyright (c) 2017, IBM.
 *
 * This source code is licensed under the Apache License, Version 2.0 found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const path = require('path');

const utils = require('lodash');
const debug = require('debug');
const ayb = require('all-your-base');

const { version } = require('./package.json');
const genRandom = require('./lib/genRandom');

function pathToTag(fullPath) {
  const res = path.basename(fullPath, '.js');

  if (!res || res === fullPath) {
    throw new Error('Not valid path');
  } else {
    return res;
  }
}

// Exposed stuff.
utils.version = version;
utils.pathToTag = pathToTag;
utils.debug = debug;
utils.ayb = ayb;
utils.genRandom = genRandom;

module.exports = utils;
