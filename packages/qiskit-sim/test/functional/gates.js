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

const { gates } = require('../..');

describe('sim:gates', () => {
  it('should include all supported ones', () =>
    assert.deepEqual(Object.keys(gates), [
      'x',
      'y',
      'z',
      'h',
      'srn',
      's',
      'r2',
      'r4',
      'r8',
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
});
