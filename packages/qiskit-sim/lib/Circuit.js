/**
 * @license
 *
 * Copyright (c) 2017, IBM.
 *
 * This source code is licensed under the Apache License, Version 2.0 found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

// Initially forked from: https://github.com/perak/quantum-circuit

'use strict';

const math = require('mathjs');

const utils = require('./utils');
const gates = require('./gates');

const dbg = utils.dbg(__filename);

const randomString = length => {
  const len = length || 17;
  let text = '';
  // var first char to be letter
  let charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  text += charset.charAt(Math.floor(Math.random() * charset.length));
  // other chars can be numbers
  charset += '0123456789';

  for (let i = 0; i < len; i += 1) {
    text += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  return text;
};

function formatComplex(complex) {
  const re = math.round(complex.re, 8);
  const im = math.round(complex.im, 8);

  return `${re}${im >= 0 ? '+' : '-'}${math.abs(im)}i`;
}

function decompose(obj) {
  if (!obj.gates.length) {
    return obj;
  }

  function injectArray(a1, a2, pos) {
    return a1
      .slice(0, pos)
      .concat(a2)
      .concat(a1.slice(pos));
  }

  for (let column = 0; column < obj.gates[0].length; column += 1) {
    for (let wire = 0; wire < obj.nQubits; wire += 1) {
      const gate = obj.gates[wire][column];

      if (gate && gate.connector === 0 && !gates[gate.name]) {
        // eslint-disable-next-line no-use-before-define
        const tmp = new Circuit();
        const custom = obj.customGates[gate.name];

        if (custom) {
          tmp.load(custom);
          const decomposed = tmp.save(true);
          const empty = [];

          for (let i = 0; i < decomposed.gates[0].length - 1; i += 1) {
            empty.push(null);
          }
          // shift columns right
          for (let w = 0; w < obj.nQubits; w += 1) {
            const g = obj.gates[w][column];

            if (g && g.id === gate.id) {
              obj.gates[w].splice(column, 1);
              // eslint-disable-next-line no-param-reassign
              obj.gates[w] = injectArray(
                obj.gates[w],
                decomposed.gates[g.connector],
                column,
              );
            } else {
              // eslint-disable-next-line no-param-reassign
              obj.gates[w] = injectArray(obj.gates[w], empty, column + 1);
            }
          }
        }
      }
    }
  }

  // eslint-disable-next-line no-param-reassign
  obj.customGates = [];

  return obj;
}

class Circuit {
  constructor(opts = {}) {
    this.nQubits = opts.nQubits || 1;
    this.customGates = {};
    this.clear();
  }

  resetTransform() {
    this.T = [];
  }

  reset() {
    this.state = [];
    this.resetTransform();
  }

  clear() {
    this.gates = [];

    for (let i = 0; i < this.nQubits; i += 1) {
      this.gates.push([]);
    }
    this.reset();
  }

  numAmplitudes() {
    return math.pow(2, this.nQubits);
  }

  initTransform() {
    this.resetTransform();
    const n = math.pow(2, this.nQubits);

    for (let i = 0; i < n; i += 1) {
      this.T[i] = [];

      for (let j = 0; j < n; j += 1) {
        this.T[i][j] = 0;
      }
    }
  }

  init() {
    this.reset();
    this.state.push(math.complex(1, 0));
    const numAmplitudes = this.numAmplitudes();

    for (let i = 1; i < numAmplitudes; i += 1) {
      this.state.push(math.complex(0, 0));
    }

    this.initTransform();
  }

  numCols() {
    return this.gates.length ? this.gates[0].length : 0;
  }

  addGate(gateName, column, wires) {
    const wireList = [];

    if (Array.isArray(wires)) {
      for (let i = 0; i < wires.length; i += 1) {
        wireList.push(wires[i]);
      }
    } else {
      wireList.push(wires);
    }

    const numConnectors = wireList.length;
    const id = randomString();
    for (let connector = 0; connector < numConnectors; connector += 1) {
      const wire = wireList[connector];

      if (wire + 1 > this.nQubits) {
        this.nQubits = wire + 1;
      }

      while (this.gates.length < this.nQubits) {
        this.gates.push([]);
      }

      let numCols = this.numCols();
      if (column + 1 > numCols) {
        numCols = column + 1;
      }

      for (let i = 0; i < this.gates.length; i += 1) {
        while (this.gates[i].length < numCols) {
          this.gates[i].push(null);
        }
      }

      const gate = {
        id,
        name: gateName.toLowerCase(),
        connector,
      };

      this.gates[wire][column] = gate;
    }
  }

  createTransform(U, qubits) {
    this.initTransform();

    const qbts = [];
    // eslint-disable-next-line no-param-reassign
    qubits = qubits.slice(0);
    for (let i = 0; i < qubits.length; i += 1) {
      // eslint-disable-next-line no-param-reassign
      qubits[i] = this.nQubits - 1 - qubits[i];
    }
    qubits.reverse();
    for (let i = 0; i < this.nQubits; i += 1) {
      if (qubits.indexOf(i) === -1) {
        qbts.push(i);
      }
    }

    const n = math.pow(2, this.nQubits);
    let i = n;
    // eslint-disable-next-line no-cond-assign,no-plusplus
    while (i--) {
      let j = n;

      // eslint-disable-next-line no-cond-assign,no-plusplus
      while (j--) {
        let bitsEqual = true;
        let k = qbts.length;

        // eslint-disable-next-line no-cond-assign,no-plusplus
        while (k--) {
          // eslint-disable-next-line no-bitwise
          if ((i & (1 << qbts[k])) !== (j & (1 << qbts[k]))) {
            bitsEqual = false;
            break;
          }
        }
        if (bitsEqual) {
          let istar = 0;
          let jstar = 0;
          k = qubits.length;
          // eslint-disable-next-line no-cond-assign,no-plusplus
          while (k--) {
            const q = qubits[k];
            // eslint-disable-next-line no-bitwise
            istar |= ((i & (1 << q)) >> q) << k;
            // eslint-disable-next-line no-bitwise
            jstar |= ((j & (1 << q)) >> q) << k;
          }
          this.T[i][j] = U[istar][jstar];
        }
      }
    }
  }

  applyGate(gateName, wires) {
    dbg('Applying gate', { gateName, wires });

    const gate = gates[gateName.toLowerCase()];

    if (!gate) {
      throw new Error(`Unknown gate: "${gateName}"`);
    }
    this.createTransform(gate, wires);
    this.state = math.multiply(this.T, this.state);
  }

  save(decomposed) {
    const data = {
      nQubits: this.nQubits,
      gates: this.gates,
      customGates: this.customGates,
    };

    if (decomposed) {
      return decompose(data);
    }

    return data;
  }

  load(obj) {
    this.nQubits = obj.nQubits || 1;
    this.clear();
    this.gates = obj.gates;
    this.customGates = obj.customGates;
  }

  getGateAt(column, wire) {
    if (!this.gates[wire]) {
      return null;
    }

    const gate = this.gates[wire][column];
    if (!gate) {
      return null;
    }
    gate.wires = [];

    const { id } = gate;
    const numWires = this.gates.length;

    for (let wire2 = 0; wire2 < numWires; wire2 += 1) {
      const g = this.gates[wire2][column];
      if (g && g.id === id) {
        gate.wires[g.connector] = wire2;
      }
    }
    return gate;
  }

  run(initialValues) {
    this.init();

    dbg('State inited', { initialValues });

    if (initialValues) {
      for (let wire = 0; wire < this.nQubits; wire += 1) {
        if (initialValues[wire]) {
          this.applyGate('x', [wire]);
        }
      }
    }

    const decomposed = new Circuit();
    decomposed.load(this.save(true));
    dbg('Decompose ready');

    const numCols = decomposed.numCols();

    dbg('Iterating ...', { numCols, nQubits: this.nQubits });
    for (let column = 0; column < numCols; column += 1) {
      for (let wire = 0; wire < this.nQubits; wire += 1) {
        dbg('New iter', { column, wire });

        const gate = decomposed.getGateAt(column, wire);

        dbg('Got gate', gate);
        if (gate && gate.connector === 0) {
          dbg('Applying gate ...');

          this.applyGate(gate.name, gate.wires);
        }
      }
    }
  }

  stateToString() {
    const numAmplitudes = this.numAmplitudes();

    if (!this.state || this.state.length < numAmplitudes) {
      throw new Error(
        'Circuit is not initialized. Please call init() or run() method',
      );
    }

    let s = '';
    for (let i = 0; i < numAmplitudes; i += 1) {
      if (i) {
        s += '\n';
      }

      const m = math.round(math.pow(math.abs(this.state[i]), 2) * 100, 2);
      let bin = i.toString(2);
      while (bin.length < this.nQubits) {
        bin = `0${bin}`;
      }
      s += `${formatComplex(this.state[i])}|${bin}>${m}%`;
    }

    return s;
  }
}

module.exports = Circuit;
