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

const buildControlled = Gate => {
  const U = Gate.matrix;
  const m = U.length;
  const C = identityMatrix(m * 2);

  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < m; j += 1) {
      C[i + m][j + m] = U[i][j];
    }
  }

  return C;
};

const phaseShift = shift =>
  [[1, 0], [0, math.pow(math.e, math.multiply(math.i, math.PI / shift))]];

class Gate {
  constructor(name, matrix) {
    this.name = name;
    this.matrix = matrix;
  }
}

Gate.x = new Gate('x', [[0, 1], [1, 0]]);
Gate.y = new Gate('y', [[0, math.multiply(-1, math.i)], [math.i, 0]]);
Gate.z = new Gate('z', [[1, 0], [0, -1]]);
Gate.id = new Gate('id', [[1, 0], [0, 1]]);
Gate.h = new Gate('h',
                  [[1 / math.sqrt(2), 1 / math.sqrt(2)],
                   [1 / math.sqrt(2), 0 - 1 / math.sqrt(2)]]);
Gate.srn = new Gate('srn',
                    [[1 / math.sqrt(2), 0 - 1 / math.sqrt(2)],
                     [1 / math.sqrt(2), 1 / math.sqrt(2)]]);
Gate.s = new Gate('s', phaseShift(2));
Gate.r2 = new Gate('r2', Gate.s.matrix);
Gate.r4 = new Gate('r4', phaseShift(4));
Gate.r8 = new Gate('r8', phaseShift(8));
Gate.t = new Gate('t', Gate.r4.matrix);
Gate.swap = new Gate('swap',
                     [[1, 0, 0, 0], [0, 0, 1, 0], [0, 1, 0, 0], [0, 0, 0, 1]]);
Gate.srswap = new Gate('srswap',
                      [
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
                      ]);
Gate.cx = new Gate('cx', buildControlled(Gate.x));
Gate.cy = new Gate('cy', buildControlled(Gate.y));
Gate.cz = new Gate('cz', buildControlled(Gate.z));
Gate.ch = new Gate('ch', buildControlled(Gate.h));
Gate.csrn = new Gate('csrn', buildControlled(Gate.srn));
Gate.cs = new Gate('cs', buildControlled(Gate.s));
Gate.cr2 = new Gate('cr2', buildControlled(Gate.r2));
Gate.cr4 = new Gate('cr4', buildControlled(Gate.r4));
Gate.cr8 = new Gate('cr8', buildControlled(Gate.r8));

const gates = new Map(Object.entries(Gate));

module.exports = {
  Gate,
  gates
};
