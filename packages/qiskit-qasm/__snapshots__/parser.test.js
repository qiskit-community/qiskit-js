exports['qasm:parse should work with "IBMQASM 2.0" as version header 1'] = [
  {
    "type": "qubit",
    "identifier": "q",
    "number": "1"
  },
  {
    "type": "clbit",
    "identifier": "c",
    "number": "1"
  },
  {
    "type": "measure",
    "qreg": {
      "name": "q"
    },
    "creg": {
      "name": "c"
    }
  }
]

exports['qasm:parse should work with with "OPENQASM 2.0" as version header 1'] = [
  {
    "type": "qubit",
    "identifier": "q",
    "number": "1"
  },
  {
    "type": "clbit",
    "identifier": "c",
    "number": "1"
  },
  {
    "type": "measure",
    "qreg": {
      "name": "q"
    },
    "creg": {
      "name": "c"
    }
  }
]

exports['qasm:parse should work with "include" 1'] = [
  {
    "type": "qubit",
    "identifier": "q",
    "number": "5"
  },
  {
    "type": "clbit",
    "identifier": "c",
    "number": "5"
  },
  {
    "type": "x",
    "identifiers": [
      {
        "name": "q",
        "index": "0"
      }
    ]
  },
  {
    "type": "measure",
    "qreg": {
      "name": "q"
    },
    "creg": {
      "name": "c"
    }
  }
]

exports['qasm:parse should work with RESET 1'] = [
  {
    "type": "qubit",
    "identifier": "q",
    "number": "1"
  },
  {
    "type": "clbit",
    "identifier": "c",
    "number": "1"
  },
  {
    "type": "reset",
    "qreg": {
      "name": "q",
      "index": "0"
    }
  }
]

exports['qasm:parse should fail with "include" 1'] = [
  {
    "type": "qubit",
    "identifier": "q",
    "number": "1"
  },
  {
    "type": "clbit",
    "identifier": "c",
    "number": "1"
  },
  {
    "type": "x",
    "identifiers": [
      {
        "name": "q",
        "index": "1"
      }
    ]
  }
]

exports['qasm:parse should work with OPAQUE gate (1) 1'] = [
  {
    "type": "qubit",
    "identifier": "q",
    "number": "1"
  },
  {
    "type": "clbit",
    "identifier": "c",
    "number": "1"
  },
  {
    "type": "opaque",
    "bitList": [
      "a",
      "b",
      "c"
    ]
  }
]

exports['qasm:parse should work with OPAQUE gate (2) 1'] = [
  {
    "type": "qubit",
    "identifier": "q",
    "number": "1"
  },
  {
    "type": "clbit",
    "identifier": "c",
    "number": "1"
  },
  {
    "type": "opaque",
    "bitList": [
      "a",
      "b",
      "c"
    ]
  }
]

exports['qasm:parse should work with OPAQUE gate (3) 1'] = [
  {
    "type": "qubit",
    "identifier": "q",
    "number": "1"
  },
  {
    "type": "clbit",
    "identifier": "c",
    "number": "1"
  },
  {
    "type": "opaque",
    "bitList": [
      "a",
      "b",
      "c"
    ],
    "gateIdList": [
      "x",
      "y"
    ]
  }
]
