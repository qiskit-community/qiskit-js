/**
  * The goal of this program is to simulate the deutsch-oracle
  * algoritm and provide a JavaScript example for it.
  *
  * There are lots of great resources on the internet that provide
  * the theory. Our hope is that this can compliment those resources.
  *
  * Usage
  * Run as a script:
  * $ node ./example/deutsch-oracle.js
  *
  * Step through with debugger:
  * $ node --inspect-brk ./example/deutsch-oracle.js
  *
  * Run in RPEL:
  * $ node
  * Welcome to Node.js v12.4.0.
  * Type ".help" for more information.
  * > const d = require('./example/deutsch-oracle.js');
  * > d.balanced0()
  * > d.balanced1()
  * > d.const0()
  * > d.const1()
  */
const { Circuit, Gate } = require('..');

/* eslint-disable */

const printTensor = (state) =>  {
  if (state[0].re === 0 && state[1].re === 0) {
    _printTensor([0, 1], [state[2].re, state[3].re]);
  } else {
    _printTensor([1, 0], [state[0].re, state[1].re]);
  }
}

function _printTensor(qubit0, qubit1) {
  const padding = 23;
  console.log(`${qubit0[0]}  ⌈${qubit1[0]}`.padEnd(padding, ' ') + '⌉');
  console.log(`   ⌊${qubit1[1]}`.padEnd(padding, ' ') + '⌋');
  console.log(`${qubit0[1]}  ⌈${qubit1[0]}`.padEnd(padding, ' ') + '⌉');
  console.log(`   ⌊${qubit1[1]}`.padEnd(padding, ' ') + '⌋');
}

function print(oracle) {
  oracle.forEach((row) => { console.log(row); } );
  console.log();
}

function measureQubit0(state) {
  return state[0].re === 0 && state[1].re === 0 ? '|1>' : '|0>';
}

function run(fn) {
  const matrix = oracleMatrixFrom(fn);
  const circuit = Circuit.createCircuit(2);
  circuit.init();
  circuit.add(Gate.x, 0, 1)
         .add(Gate.h, 1, 0)
         .add(Gate.h, 1, 1)
         .add(new Gate('uf', matrix), 2, [0, 1])
         .add(Gate.h, 3, 0)
         .print();

  console.log('Oracle matrix (uf):');
  print(matrix);

  circuit.run();

  console.log('Final state:');
  console.log(circuit.stateToString());
  console.log();

  console.log('Show tensor state:');
  printTensor(circuit.state);
  console.log();

  const qubit0 = measureQubit0(circuit.state);
  console.log('Measure qubit 0:');
  console.log(`qubit[0]: ${qubit0}, Function is ${qubit0 === '|1>' ?
              'balanced' : 'constant'}!`);
  console.log();
}

function oracleMatrixFrom(f) {
  const dim = 4;
  const input = [{x: 0, y: 0}, {x:0, y:1}, {x:1, y:0}, {x:1, y:1}];
  const matrix = [];
  for (let i = 0; i < dim; i++) {
    matrix.push(new Array(dim).fill(0));
  }

  for (let z = 0; z < input.length; z++) {
    const x = input[z].x;
    const y = input[z].y;
    const result = y ^ f(x);
    if (x === 0) {
      matrix[z][result] = 1;
    } else {
      matrix[z][2+result] = 1;
    }
  }
  return matrix;
}

function balanced0() {
  console.log('        Balanced function   f(0) = 1, f(1) = 0');
  run(x => (x === 0) ? 1 : 0);
}

function balanced1() {
  console.log('        Balanced function   f(0) = 0, f(1) = 1');
  run(x => (x === 0) ? 0 : 1);
}

function const0() {
  console.log('        Constant 0 function  f(0) = 0, f(1) = 0');
  run(x => 0);
}

function const1() {
  console.log('        Constant 1 function  f(0) = 1, f(1) = 1');
  run(x => 1);
}

module.exports = {
  balanced0,
  balanced1,
  const0,
  const1
};

if (require.main === module) {
  balanced0();
  balanced1();
  const0();
  const1();
}
