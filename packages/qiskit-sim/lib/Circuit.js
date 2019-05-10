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
const fs = require('fs');
const { Parser } = require('@qiskit/qasm');

const utils = require('./utils');
const { Gate, gates } = require('./gates');

const dbg = utils.dbg(__filename);

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

      if (gate && gate.connector === 0 && !gates.get(gate.name)) {
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
    this.amplitudes = math.pow(2, this.nQubits);
    this.customGates = {};
    this.gates = [];
    this.state = [];
    this.T = [];
  }

  resetTransform() {
    this.T = [];
  }

  reset() {
    if (this.state == null) {
      this.state = [];
    }
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
    return this.amplitudes;
  }

  initTransform(dimension) {
    this.resetTransform();

    for (let i = 0; i < dimension; i += 1) {
      this.T[i] = [];

      for (let j = 0; j < dimension; j += 1) {
        this.T[i][j] = 0;
      }
    }
  }

  init() {
    this.reset();
    const numAmplitudes = this.numAmplitudes();

    if (this.state.length === 0) {
      this.state.push(math.complex(1, 0));
      for (let i = 1; i < numAmplitudes; i += 1) {
        this.state.push(math.complex(0, 0));
      }
    }

    this.initTransform(numAmplitudes);
  }

  numCols() {
    return this.gates.length ? this.gates[0].length : 0;
  }

  addGate(gate, column, wires) {
    const wireList = [];

    if (Array.isArray(wires)) {
      wireList.push(...wires);
    } else {
      wireList.push(wires);
    }

    const numConnectors = wireList.length;
    const id = utils.randomString();
    for (let connector = 0; connector < numConnectors; connector += 1) {
      const wire = wireList[connector];

      if (wire + 1 > this.nQubits) {
        this.nQubits = wire + 1;
        this.amplitudes = math.pow(2, this.nQubits);
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


      this.gates[wire][column] = {
        id,
        name: (gate instanceof Gate) ? gate.name : gate.toLowerCase(),
        connector,
        multiQubit: numConnectors > 1,
      };
    }
    return this;
  }

  add(gate, column, wire) {
    if (!(gate instanceof Gate)) {
      throw new TypeError('The "gate" argument must be of type Gate. ' +
                          `Received ${typeof gate}`);
    }
    return this.addGate(gate, column, wire);
  }


  createTransform(U, qubits) {
    const dimension = this.numAmplitudes();
    this.initTransform(dimension);

    // eslint-disable-next-line no-param-reassign
    qubits = qubits.slice(0);
    for (let i = 0; i < qubits.length; i += 1) {
      // eslint-disable-next-line no-param-reassign
      qubits[i] = this.nQubits - 1 - qubits[i];
    }
    qubits.reverse();
    const unusedWires = [];
    for (let i = 0; i < this.nQubits; i += 1) {
      if (qubits.indexOf(i) === -1) {
        unusedWires.push(i);
      }
    }

    let i = dimension;
    // eslint-disable-next-line no-cond-assign,no-plusplus
    while (i--) {
      let j = dimension;

      // eslint-disable-next-line no-cond-assign,no-plusplus
      while (j--) {
        let bitsEqual = true;
        let unusedCount = unusedWires.length;

        // eslint-disable-next-line no-cond-assign,no-plusplus
        while (unusedCount--) {
          // eslint-disable-next-line no-bitwise
          const b = 1 << unusedWires[unusedCount];
          // eslint-disable-next-line no-bitwise
          if ((i & b) !== (j & b)) {
            bitsEqual = false;
            break;
          }
        }
        let k = qubits.length;
        if (bitsEqual) {
          let istar = 0;
          let jstar = 0;
          // eslint-disable-next-line no-cond-assign,no-plusplus
          while (k--) {
            const q = qubits[k];
            // eslint-disable-next-line no-bitwise
            istar |= ((i & (1 << q)) >> q) << k;
            // eslint-disable-next-line no-bitwise
            jstar |= ((j & (1 << q)) >> q) << k;
          }
          this.T[i][j] = U.matrix[istar][jstar];
        }
      }
    }
  }

  applyGate(gateName, wires) {
    dbg('Applying gate', { gateName, wires });

    const gate = gates.get(gateName.toLowerCase());

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
      state: this.state
    };

    if (decomposed) {
      return decompose(data);
    }

    return data;
  }

  load(obj) {
    this.nQubits = obj.nQubits || 1;
    this.amplitudes = math.pow(2, this.nQubits);
    this.clear();
    this.gates = obj.gates;
    this.customGates = obj.customGates;
    this.state = obj.state;
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
          this.applyGate(Gate.x.name, [wire]);
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
      s += `${utils.formatComplex(this.state[i])}|${bin}>${m}%`;
    }

    return s;
  }

  print(writable = process.stdout) {
    const columnLen = 10;
    const spaceLen = 4;
    const gateLen = 4;

    const connectionsMap = new Map();
    for (let column = 0; column < this.gates[0].length; column += 1) {
      for (let wire = 0; wire < this.nQubits; wire += 1) {
        const gate = this.gates[wire][column];
        if (gate && gate.multiQubit) {
          const m = connectionsMap.has(column) ? connectionsMap.get(column) :
            new Map();
          let entry;
          if (m.has(gate.id)) {
            entry = m.get(gate.id);
            entry.to = wire;
          } else {
            entry = {from: wire,
                     fromVisited: false,
                     to: null,
                     toVisited: false};
          }
          m.set(gate.id, entry);
          connectionsMap.set(column, m);
        }
      }
    }

    let columnHeader = ''.padStart(columnLen);
    for (let i = 0; i < this.numCols(); i += 1) {
      columnHeader += `column ${i}`.padEnd(columnLen, ' ');
      columnHeader += ''.padEnd(spaceLen, ' ');
    }
    writable.write('\n');
    writable.write(columnHeader);
    writable.write('\n');

    const connStarted = Array(this.numCols()).fill(false);
    for (let wire = 0; wire < this.nQubits; wire += 1) {
      writable.write(`wire ${wire} `.padEnd(columnLen, '-'));
      let wireOutput = '';
      let connOutput = ''.padStart(columnLen, ' ');
      for (let column = 0; column < this.gates[wire].length; column += 1) {
        const gate = this.getGateAt(column, wire);
        const connections = connectionsMap.get(column);
        if (connections) {
          if (gate && connections.has(gate.id)) {
            const c = connections.get(gate.id);
            if (c.from === wire) {
              c.fromVisited = true;
              connStarted[column] = true;
            }
            if (c.to === wire) {
              c.toVisited = true;
              connStarted[column] = true;
            }

            if (c.fromVisited === true && c.toVisited === true) {
              connections.delete(gate.id);
              if (connections.size === 0) {
                connectionsMap.delete(column);
              }
            } else {
              connOutput += ` |`;
            }
          } else if (connStarted[column]) {
            connOutput += ` |`;
          }
        }

        if (gate) {
          if (gate.multiQubit && gate.connector !== 0) {
            wireOutput += `[*]`.padEnd(gateLen, '-');
          } else {
            wireOutput += `[${gate.name}]`.padEnd(gateLen, '-');
            connOutput += ''.padEnd(gateLen, ' ');
          }
        } else {
          wireOutput += ''.padEnd(gateLen, '-');
          connOutput += ''.padEnd(gateLen, ' ');
        }
        wireOutput += ''.padEnd(columnLen, '-');
        connOutput += ''.padEnd(columnLen, ' ');
      }
      writable.write(wireOutput);
      writable.write('\n');
      writable.write(connOutput);
      writable.write('\n');
    }
  }

  static createCircuit(qubits) {
    if (typeof qubits !== 'number')
      throw new TypeError('The "qubits" argument must be of type number. ' +
                          `Received ${typeof qubits}`);
    return new Circuit({nQubits: qubits});
  }

  static fromQasm(qasm) {
    const parser = new Parser();
    const parsed = parser.parse(qasm);
    let qubits = 0;
    const wiresMap = new Map();
    const gatesArr = [];

    parsed.forEach((entry) => {
      if (entry.type === 'qubit') {
        wiresMap.set(entry.identifier, {offset: qubits, columnCount: 0});
        qubits += parseInt(entry.number, 10);
      }

      if (entry.type === 'gate') {
        gatesArr.push(entry);
      }
    });

    const circuit = Circuit.createCircuit(qubits);

    for (let i = 0; i < gatesArr.length; i += 1) {
      const wires = [];
      const gate = gatesArr[i];
      let column;
      for (let y = 0; y < gate.identifiers.length; y += 1) {
        const id = gate.identifiers[y];
        if (y === 0) {
          column = wiresMap.get(id.name).columnCount;
          wiresMap.get(id.name).columnCount += 1;
        }
        const { index } = id
        const { offset } = wiresMap.get(id.name);
        wires.push(parseInt(offset, 10) + parseInt(index, 10));
      }
      circuit.addGate(gate.name, column, wires);
    }
    return circuit;
  }

  static fromQasmFile(path) {
    return Circuit.fromQasm(fs.readFileSync(path, {encoding:'utf8'}));
  }
}
module.exports = Circuit;
