/**
 * @license
 *
 * Copyright (c) 2017, IBM.
 *
 * This source code is licensed under the Apache License, Version 2.0 found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const rp = require('request-promise-native');

const utils = require('./utils');

const dbg = utils.dbg(__filename);

async function getHex(len) {
  if (len < 1) {
    throw new Error('Invalid length (< 1)');
  }

  const body = await rp({
    uri: 'http://qrng.anu.edu.au/API/jsonI.php',
    qs: {
      type: 'hex16',
      size: '1',
      length: len,
    },
    json: true,
  });

  if (!body.success) {
    throw new Error('Unknown error');
  }

  return body.data;
}

module.exports = async (len = 16) => {
  // "/2" The library expects the number of octects and we ask for number of
  // hexadecimal digits (8 octets = 16 hex chars).
  const octects = await getHex(len / 2);
  dbg('Generated number (octects):', { octects, len: octects.length });

  if (!octects || !utils.isArray(octects)) {
    throw new Error('Parsing the result (octects)');
  }

  const strHex = octects.join('');
  dbg('Random string (hex):', { strHex });

  return strHex;
};
