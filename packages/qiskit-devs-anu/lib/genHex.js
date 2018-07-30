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

const utils = require('./utils');
const qrand = util.promisify(require('qrand').getRandomHexOctets);

const dbg = utils.dbg(__filename);

module.exports = async (len = 16) => {
  // "/2" The library expecst the number of octects and we ask for number of
  // hexadecimal digits (8 octets = 16 hex chars).
  const octects = await qrand(len / 2);
  dbg('Generated number (octects):', { octects, len: octects.length });

  if (!octects || !utils.isArray(octects)) {
    throw new Error('Parsing the result (octects)');
  }

  const strHex = octects.join('');
  dbg('Random string (hex):', { strHex });

  return strHex;
};
