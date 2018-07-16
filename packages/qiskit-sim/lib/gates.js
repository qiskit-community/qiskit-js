/**
 * @license
 *
 * Copyright (c) 2017, IBM.
 *
 * This source code is licensed under the Apache License, Version 2.0 found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const math = require('mathjs');

const identityMatrix = n => {
  const matrix = [];

  for (let i = 0; i < n; i += 1) {
    matrix[i] = [];

    for (let j = 0; j < n; j += 1) {
      matrix[i][j] = j === i ? 1 : 0;
    }
  }

  return matrix;
};

const buildControlled = U => {
  const m = U.length;
  const C = identityMatrix(m * 2);

  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < m; j += 1) {
      C[i + m][j + m] = U[i][j];
    }
  }

  return C;
};

const gates = {
  x: [[0, 1], [1, 0]],
  y: [[0, math.multiply(-1, math.i)], [math.i, 0]],
  z: [[1, 0], [0, -1]],
  h: [
    [1 / math.sqrt(2), 1 / math.sqrt(2)],
    [1 / math.sqrt(2), 0 - 1 / math.sqrt(2)],
  ],
  srn: [
    [1 / math.sqrt(2), 0 - 1 / math.sqrt(2)],
    [1 / math.sqrt(2), 1 / math.sqrt(2)],
  ],
  s: [[1, 0], [0, math.pow(math.e, math.multiply(math.i, math.PI / 2))]],
  r2: [[1, 0], [0, math.pow(math.e, math.multiply(math.i, math.PI / 2))]],
  r4: [[1, 0], [0, math.pow(math.e, math.multiply(math.i, math.PI / 4))]],
  r8: [[1, 0], [0, math.pow(math.e, math.multiply(math.i, math.PI / 8))]],
  swap: [[1, 0, 0, 0], [0, 0, 1, 0], [0, 1, 0, 0], [0, 0, 0, 1]],
  srswap: [
    [1, 0, 0, 0],
    [
      0,
      math.multiply(0.5, math.add(1, math.i)),
      math.multiply(0.5, math.subtract(1, math.i)),
      0,
    ],
    [
      0,
      math.multiply(0.5, math.subtract(1, math.i)),
      math.multiply(0.5, math.add(1, math.i)),
      0,
    ],
    [0, 0, 0, 1],
  ],
};

gates.cx = buildControlled(gates.x);
gates.cy = buildControlled(gates.y);
gates.cz = buildControlled(gates.z);
gates.ch = buildControlled(gates.h);
gates.csrn = buildControlled(gates.srn);
gates.cs = buildControlled(gates.s);
gates.cr2 = buildControlled(gates.r2);
gates.cr4 = buildControlled(gates.r4);
gates.cr8 = buildControlled(gates.r8);

module.exports = gates;
