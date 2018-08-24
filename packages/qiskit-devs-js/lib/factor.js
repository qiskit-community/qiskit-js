/**
 * @license
 *
 * Copyright (c) 2017, IBM.
 *
 * This source code is licensed under the Apache License, Version 2.0 found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

// Shor's factoring algorithm.
// See https://cs.uwaterloo.ca/~watrous/lecture-notes/519/11.pdf
// Initially forked from from here:
// https://github.com/davidbkemp/jsqubits/blob/master/examples/algorithms/factoring.js

const jsqubits = require('jsqubits/lib/jsqubits');
const jsqubitsmath = require('jsqubits/lib/jsqubitsmath');
const utils = require('./utils');

const dbg = utils.dbg(__filename);

function computeOrder(a, n) {
  const numOutBits = Math.ceil(Math.log(n) / Math.log(2));
  const numInBits = 2 * numOutBits;
  const inputRange = 2 ** numInBits;
  const outputRange = 2 ** numOutBits;
  const accuracyRequiredForContinuedFraction =
    1 / (2 * outputRange * outputRange);
  const outBits = {
    from: 0,
    to: numOutBits - 1,
  };
  const inputBits = {
    from: numOutBits,
    to: numOutBits + numInBits - 1,
  };
  const f = x => jsqubitsmath.powerMod(a, x, n);
  const f0 = f(0);

  // This function contains the actual quantum computation part of the algorithm.
  // It returns either the frequency of the function f or some integer multiple
  // (where "frequency" is the number of times the period of f will fit into 2^numInputBits)
  function determineFrequency(fu) {
    let qstate = new jsqubits.QState(numInBits + numOutBits).hadamard(
      inputBits,
    );
    qstate = qstate.applyFunction(inputBits, outBits, fu);
    // We do not need to measure the outBits, but it does speed up the simulation.
    qstate = qstate.measure(outBits).newState;

    return qstate.qft(inputBits).measure(inputBits).result;
  }

  // Determine the period of f (i.e. find r such that f(x) = f(x+r).
  function findPeriod() {
    let bestSoFar = 1;

    for (let attempts = 0; attempts < 2 * numOutBits; attempts += 1) {
      // NOTE: Here we take advantage of the fact that, for Shor's algorithm,
      // we know that f(x) = f(x+i) ONLY when i is an integer multiple of the rank r.
      if (f(bestSoFar) === f0) {
        dbg(`The period of ${a}^x mod ${n} is ${bestSoFar}`);
        return bestSoFar;
      }

      const sample = determineFrequency(f);

      // Each "sample" has a high probability of being approximately equal to some
      // integer multiple of (inputRange/r) rounded to the nearest integer.
      // So we use a continued fraction function to find r (or a divisor of r).
      const continuedFraction = jsqubitsmath.continuedFraction(
        sample / inputRange,
        accuracyRequiredForContinuedFraction,
      );
      // The denominator is a "candidate" for being r or a divisor of r (hence we need to find
      // the least common multiple of several of these).
      const candidateDivisor = continuedFraction.denominator;
      dbg('Candidate divisor of r: ', { candidateDivisor });

      // Reduce the chances of getting the wrong answer by ignoring obviously wrong results!
      if (candidateDivisor > 1 && candidateDivisor <= outputRange) {
        if (f(candidateDivisor) === f0) {
          dbg('This is a multiple of the rank');
          bestSoFar = candidateDivisor;
        } else {
          const lcm = jsqubitsmath.lcm(candidateDivisor, bestSoFar);
          if (lcm <= outputRange) {
            dbg('This is a good candidate');
            bestSoFar = lcm;
          }
        }
      }
      dbg('Least common multiple so far: ', { bestSoFar, attempts });
    }
    dbg(`Giving up trying to find rank of ${a}`);
    return 'failed';
  }

  // Step 2: compute the period of a^x mod n
  return findPeriod();
}

module.exports = n => {
  if (n % 2 === 0) {
    // Is even.  No need for any quantum computing!
    return 2;
  }

  const powerFactor = jsqubitsmath.powerFactor(n);
  if (powerFactor > 1) {
    // Is a power factor.  No need for anything quantum!
    return powerFactor;
  }

  for (let attempts = 0; attempts < 8; attempts += 1) {
    const randomChoice = 2 + Math.floor(Math.random() * (n - 2));
    dbg(`Step 1: chose random number between 2 and ${n}`, { randomChoice });
    const gcd = jsqubitsmath.gcd(randomChoice, n);
    if (gcd > 1) {
      dbg(
        `Lucky guess, ${n} and randomly chosen ${randomChoice} have a common factor`,
        { gcd },
      );
      return gcd;
    }

    const r = computeOrder(randomChoice, n);
    if (r !== 'failed' && r % 2 !== 0) {
      dbg(`Need a period with an even number. Sadly, ${r} is not`);
    } else if (r !== 'failed' && r % 2 === 0) {
      const powerMod = jsqubitsmath.powerMod(randomChoice, r / 2, n);
      const candidateFactor = jsqubitsmath.gcd(powerMod - 1, n);
      dbg('Candidate factor computed from period', { candidateFactor });
      if (candidateFactor > 1 && n % candidateFactor === 0) {
        return candidateFactor;
      }
    }
    dbg('Try again');
  }

  // throw new Error('Failed');
  return 'failed';
};
