/**
 * @license
 *
 * Copyright (c) 2017, IBM.
 *
 * This source code is licensed under the Apache License, Version 2.0 found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const assert = require('assert');

const { gates, Gate } = require('../..');

describe('sim:gates', () => {
  it('should include all supported ones', () =>
    assert.deepEqual([...gates.keys()], [
      'x',
      'y',
      'z',
      'id',
      'h',
      'srn',
      's',
      'r2',
      'r4',
      'r8',
      't',
      'swap',
      'srswap',
      'cx',
      'cy',
      'cz',
      'ch',
      'csrn',
      'cs',
      'cr2',
      'cr4',
      'cr8',
    ]));
  it('t gate should have the same unitary matrix as the r4 gate', () => {
    assert.deepEqual(Gate.t.matrix, Gate.r4.matrix);
  });

  it('prettyMatrix should return a pretty matrix', () => {
    const expected = '[1, 0, 0, 0]\n' +
                     '[0, 1, 0, 0]\n' +
                     '[0, 0, 0, 1]\n' +
                     '[0, 0, 1, 0]\n';
    assert.strictEqual(Gate.cx.prettyMatrix(), expected);
  });

  it('custom gate should be added to gates map', () => {
    const custom = new Gate('custom', [[1, 0], [0, 1]]);
    assert.ok(gates.has(custom.name));
  });

  it('custom gate should be allowed to be overwritten', () => {
    const custom = new Gate('custom', [[1, 0], [0, 1]]);
    const newMatrix = [[1, 0],
                      [1, 1]];
    const overwrite = new Gate(custom.name, newMatrix);
    assert.ok(gates.has(overwrite.name));
    assert.strictEqual(gates.get(custom.name).matrix, newMatrix);
  });

});
