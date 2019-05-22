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
});
