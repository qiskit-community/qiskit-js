/**
 * @license
 *
 * Copyright (c) 2017, IBM.
 *
 * This source code is licensed under the Apache License, Version 2.0 found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const engineJs = require('@qiskit/algo-js');
const engineAnu = require('@qiskit/algo-anu');
const engineIbm = require('@qiskit/algo-ibm');

const utils = require('./lib/utils');
const { version } = require('./package');
const cfg = require('./cfg');

const dbg = utils.dbg(__filename);
const enginesList = cfg.engines.supported;
const engines = {
  js: engineJs,
  anu: engineAnu,
  ibm: engineIbm,
};

module.exports.version = version;

module.exports.random = async (opts = {}) => {
  dbg('Passed opts:', opts);

  const engine = opts.engine || cfg.engines.default;

  if (!utils.includes(enginesList, engine)) {
    throw new TypeError(`Bad engine, supported: ${JSON.stringify(engines)}`);
  }

  return engines[engine].random(opts);
};

// TODO: For now we only have "ibm" supporting background jobs.
// We should do the same that for "random".
module.exports.result = engines.ibm.result;

module.exports.factor = async n => engines.js.factor(n);
