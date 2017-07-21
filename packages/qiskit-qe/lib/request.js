/*
  Copyright IBM Corp. 2017. All Rights Reserved.

  This code may only be used under the Apache 2.0 license found at
  http://www.apache.org/licenses/LICENSE-2.0.txt.

  Authors:
  - Jesús Pérez <jesusper@us.ibm.com>
*/

'use strict';

const rp = require('request-promise-native');

// const baseUri = 'https://quantumexperience.ng.bluemix.net/api';

module.exports = (uri, opts) => {
  if (!uri) { throw new Error('Required parameter: uri'); }

  const cfg = {
    uri,
    // qs: {},
    headers: {
      // TODO: Monitor this
      'User-Agent': 'qiskit.js',
    },
    json: true,
  };

  if (opts.token) {
    // -> uri + '?access_token=xxxxx%20xxxxx'
    cfg.qs = { access_token: opts.token };
  }

  return rp(cfg);
};
