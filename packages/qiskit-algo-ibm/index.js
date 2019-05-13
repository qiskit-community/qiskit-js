/**
 * @license
 *
 * Copyright (c) 2017, IBM.
 *
 * This source code is licensed under the Apache License, Version 2.0 found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const utils = require('./lib/utils');
const genBin = require('./lib/genBin');
const { version } = require('./package');

const dbg = utils.dbg(__filename);

module.exports.version = version;

module.exports.random = async (opts = {}) => {
  dbg('Passed opts:', opts);

  // We use opts being required to respect the qiskit-algo methods signature.
  if (!opts.custom || typeof opts.custom !== 'object') {
    throw new Error(
      'The "opts.custom" option is mandatory (a "@qiskit/cloud" logged instance)',
    );
  }

  if (opts.length) {
    if (typeof opts.length !== 'number') {
      throw new TypeError('A number expected in "length" option');
    }
  }
  const length = opts.length || 16;

  if (opts.shots) {
    if (typeof opts.shots !== 'number') {
      throw new TypeError('A number expected in "shots" option');
    }
  }
  const shots = opts.shots || 1;

  if (opts.maxCredits) {
    if (typeof opts.maxCredits !== 'number') {
      throw new TypeError('A number expected in "shots" option');
    }
  }
  const maxCredits = opts.maxCredits || null;

  if (opts.backend && typeof opts.backend !== 'string') {
    throw new TypeError('A string expected in "backend" option');
  }
  const backend = opts.backend || 'simulator';

  dbg('Parsed opts:', { length, shots, backend });

  return genBin(opts.custom, {
    length,
    backend,
    shots,
    maxCredits,
  });
};

module.exports.result = async (jobId, opts = {}) => {
  // We use opts being required to respect the qiskit-algo methods signature.
  if (!opts.custom || typeof opts.custom !== 'object') {
    throw new Error(
      'The "opts.custom" option is mandatory (a "@qiskit/cloud" logged instance)',
    );
  }

  if (!jobId || typeof jobId !== 'string') {
    throw new TypeError('The "jobId" parameter is mandatory (string)');
  }
  const cloud = opts.custom;

  const res = await cloud.job(jobId);

  const result = { status: res.status.toLowerCase() };

  if (result.status !== 'completed') {
    return result;
  }

  const binaryArray = utils.map(res.circuits, resCircuit => {
    if (
      !resCircuit.result ||
      !resCircuit.result.data ||
      !resCircuit.result.data.counts ||
      typeof resCircuit.result.data.counts !== 'object'
    ) {
      throw new Error(`Parsing the circuits result: ${JSON.stringify(res)}`);
    }

    return Object.keys(resCircuit.result.data.counts)[0];
  });
  dbg('Generated partial number (binary-array):', {
    binaryArray,
    len: binaryArray.length,
  });

  const binary = binaryArray.join('');
  dbg('Generated partial number (binary):', { binary });

  const decimal = utils.ayb.parseInt(binary, 2, 10);
  dbg('Generated number (decimal):', { decimal });

  // To return a value between 0 and 1 (similar to "Math.floor")
  result.data = decimal / 10 ** decimal.toString().length;

  return result;
};
