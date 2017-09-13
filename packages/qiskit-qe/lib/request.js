/*
  Copyright IBM Corp. 2017. All Rights Reserved.

  This code may only be used under the Apache 2.0 license found at
  http://www.apache.org/licenses/LICENSE-2.0.txt.

  Authors:
  - Jesús Pérez <jesusper@us.ibm.com>
*/

'use strict';

const rp = require('request-promise-native');


module.exports = (uri, opts = {}) => {
  if (!uri) { throw new Error('Required parameter: uri'); }

  const cfg = {
    uri,
    qs: {},
    headers: {
      // TODO: Monitor this in the backend.
      'User-Agent': 'qiskit.js',
    },
    json: true,
  };

  if (opts.body) {
    cfg.method = 'POST';
    cfg.body = opts.body;
  }

  // -> uri + '?access_token=xxxxx%20xxxxx'
  if (opts.token) {
    cfg.qs.access_token = opts.token;
  }

  // TODO: Massage the errors here.
  return rp(cfg);
};
