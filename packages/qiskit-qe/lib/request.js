/*
  Copyright IBM Corp. 2017. All Rights Reserved.

  This code may only be used under the Apache 2.0 license found at
  http://www.apache.org/licenses/LICENSE-2.0.txt.

  Authors:
  - Jesús Pérez <jesusper@us.ibm.com>
*/

'use strict';

const rp = require('request-promise-native');


async function request(uri, opts = {}) {
  if (!uri) { throw new Error('Required parameter: uri'); }

  const cfg = {
    uri,
    // Extra querystring params comes here (all but token).
    qs: opts.qs || {},
    // TODO: Monitor this in the backend.
    headers: { 'User-Agent': 'qiskit.js' },
    json: true,
  };
  if (opts.body) {
    cfg.method = 'POST';
    cfg.body = opts.body;
  }
  // -> uri + '?access_token=xxxxx%20xxxxx'
  if (opts.token) { cfg.qs.access_token = opts.token; }
  if (opts.filter) { cfg.qs.filter = JSON.stringify(opts.filter); }

  // Massaging the error, to avoid return specific HTTP stuff.
  let res;
  try {
    res = await rp(cfg);
  } catch (err) {
    if (err.error && err.error.error && err.error.error.code) {
      throw new Error(err.error.error.code);
    } else {
      // If we can´t find a custom error the original (HTTP) is returned.
      throw err.message;
    }
  }

  return res;
}


module.exports = request;
