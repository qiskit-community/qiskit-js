/*
  Copyright Jesús Pérez <jesusprubio@fsf.org>

  This code may only be used under the MIT license found at
  https://opensource.org/licenses/MIT.
*/

'use strict';

const Qe = require('@qiskit/qe');

const utils = require('./lib/utils');
const genBin = require('./lib/genBin');
const { version } = require('./package');
const { backends } = require('./cfg');


const backendNames = Object.keys(backends);
const dbg = utils.dbg(__filename);


module.exports.version = version;


module.exports.random = async (token, userId, opts = {}) => {
  dbg('Passed opts:', opts);


  if (!token || typeof token !== 'string') {
    throw new TypeError('The "token" parameter is mandatory (string)');
  }

  if (!userId || typeof userId !== 'string') {
    throw new TypeError('The "userId" parameter is mandatory (string)');
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


  if (opts.backend) {
    if (typeof opts.backend !== 'string') {
      throw new TypeError('A string expected in "backend" option');
    }

    if (!utils.includes(backendNames, opts.backend.toLowerCase())) {
      throw new Error(`Not valid "backend", allowed: ${backendNames}`);
    }
  }
  const backend = opts.backend || 'simulator';

  dbg('Parsed opts:', { length, shots, backend });

  return genBin(token, userId, {
    length,
    backend,
    shots,
    maxCredits,
  });
};


module.exports.result = async (token, userId, jobId) => {
  const qe = new Qe();

  qe.token = token;
  qe.userId = token;

  if (!token || typeof token !== 'string') {
    throw new TypeError('The "token" parameter is mandatory (string)');
  }

  if (!userId || typeof userId !== 'string') {
    throw new TypeError('The "userId" parameter is mandatory (string)');
  }

  if (!jobId || typeof jobId !== 'string') {
    throw new TypeError('The "jobId" parameter is mandatory (string)');
  }


  const res = await qe.job(jobId);

  const result = { status: res.status.toLowerCase() };

  if (result.status !== 'completed') {
    return result;
  }

  const binaryArray = utils.map(res.circuits, (resCircuit) => {
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
  dbg('Generated partial number (binary-array):', { binaryArray, len: binaryArray.length });

  const binary = binaryArray.join('');
  dbg('Generated partial number (binary):', { binary });

  const decimal = utils.ayb.parseInt(binary, 2, 10);
  dbg('Generated number (decimal):', { decimal });

  // To return a value between 0 and 1 (similar to "Math.floor").
  result.data = decimal / (10 ** decimal.toString().length);

  return result;
};
