/**
 * @license
 *
 * Copyright (c) 2017, IBM.
 *
 * This source code is licensed under the Apache License, Version 2.0 found in
 * the LICENSE.txt file in the root directory of this source tree.

 * Authors original code:
 - John Smolin
 - Jay Gambetta
 */

/**************************************************
 * Lexical Grammar
 **************************************************/
%lex
%%

"//".*                  /* skip comments */
\s+                     /* skip whitespace */ // ??
[0-9]+("."[0-9]+)\b     return 'REAL'
[-]?[0-9]+              return 'INT'
"IBMQASM"               return 'IBMQASM'
"OPENQASM"              return 'IBMQASM'
"include"               return 'include'
"\"qelib1.inc\""        return 'QELIB.INC'
"qreg"                  return 'QREG'
"creg"                  return 'CREG'
"CX"                    return 'CX'
"U"                     return 'U'
"measure"               return 'MEASURE'
"barrier"               return 'BARRIER'
"reset"                 return 'RESET'
"opaque"                return 'OPAQUE'
"->"                    return '->'
";"                     return ';'
","                     return ','
"("                     return '('
")"                     return ')'
"{"                     return '{'
"}"                     return '}'
"+"                     return '+'
"-"                     return '-'
"*"                     return '*'
"/"                     return '/'
"gate"                  return 'GATE'
"pi"                    return 'PI'
// "theta"                 return 'THETA'
// "phi"                   return 'PHI'
// "lambda"                return 'LAMBDA'
[a-z][a-zA-Z0-9]{0,30}\b return 'ID'
"["                     return '['
"]"	                    return ']'
<<EOF>>                 return 'EOF'

/lex

%left '+' '-'
%left '*' '/'
%left '^'

/**************************************************
 * HELPERS
 **************************************************/
%{
  const lodash = require('lodash');
  const util = require('util');

  // List of register definitionsutil
  const externalFuncs = ['sin', 'cos', 'tan', 'exp', 'ln', 'sqrt'];
  var registers = [];
  // List of defined Gates
  var gateDefinitions = [];

  function launchError(line, msg) {
      const err = new Error('qasm:' + msg);
      err.line = line;

      // TODO: Drop, only to debug 
      //console.log('------------------------');
      //console.log(err);
      //console.log('------------------------');

      // TODO: Use QasmError  
      throw err;
  }

  function addRegister(register, line) {
    var equalsRegisters = registers.filter(function(value) {
      return value.identifier === register.identifier;
    });

    if (equalsRegisters && equalsRegisters.length > 0) {
      launchError(line, 'Register '+ register.identifier + ' is already defined ');
    };

    registers.push(register);
  }

  function buildQReg(identifier, number) {
    return {
      type: 'qubit',
      identifier: identifier,
      number: number
    }
  }

  function buildCReg(identifier, number) {
    return {
      type: 'clbit',
      identifier: identifier,
      number: number
    }
  }

  function buildBarrier(identifiers) {
    return {
      type: 'barrier',
      identifiers
    }
  }

  function buildReset(qreg) {
    return {
      type: 'reset',
      qreg
    }
  }

  function buildMeasure(qreg, creg) {
    return {
      type: 'measure',
      qreg,
      creg
    }
  }
  
  function buildOpaque(name, gateScope, bitList, gateIdList) {
    return {
      type: 'opaque',
      gateScope,
      bitList,
      gateIdList
    }
  }

  function buildGate(name, identifiers, params, qelib, line) {
    const gate = {
      type: 'gate',
      name: name,
      identifiers
    };

    // The first time (to parse the standard library - qelib) we dont pass it.
    if (qelib) {
        const defined = lodash.find(qelib, { name }); 

        if (!defined) {
            launchError(line, `Gate ${name} is not defined`);
        }
    }

    if (params) { gate.params = params; }

    return gate;
  }

  // TODO: Review this.
  function addGate(gate, line) {
    var equalsGates = gateDefinitions.filter(function(value) {
      return value.name === gate.name;
    });

    if (equalsGates && equalsGates.length > 0) {
      launchError(line, 'Gate '+ gate.name + ' is already defined ');
    };

    gateDefinitions.push(gate);
  }
%}


/**************************************************
 * Grammar
 **************************************************/
%start StartProgram

%parse-param qelibParsed

%% /* language grammar */

StartProgram
    : MainProgram EOF
      {
        // console.log('qelibParsed:');
        // console.log(util.inspect(qelibParsed, { depth: null }));
        
        return $1;
      }
    ;

MainProgram
    : IbmDefinition
    | IbmDefinition Program { $$ = $2; }
    | Library 
    ;

IbmDefinition
    : IBMQASM REAL ';' Include
    | IBMQASM REAL ';'
    ;

Include
    : 'include' 'QELIB.INC' ';' // TODO: Support include in parser
    ;

Library
    : Declaration { $$ = [ $1 ]; }
    | Library Declaration
      {
        $$ = $Library;
        $$.push($Declaration);
      }
    ;

Program
    : Statement { $$ = [ $1 ]; }
    | Program Statement
      {
        $$ = $Program;
        $$.push($Statement);
      }
    ;

Statement
    : Declaration { addRegister($1, @1.first_line); $1; }
    | QOperation ';'
    | Magic ';'
    // TODO: The user can define its own gates
    // | GateDefinition { console.log('Definition: %j', $1); }
    ;

Declaration
    : QRegDeclaration
    | CRegDeclaration
    | GateDeclaration
    ;

QRegDeclaration
    : QREG ID '[' INT ']' ';' { $$ = buildQReg($2, $4); }
    ;

CRegDeclaration
    : CREG ID '[' INT ']' ';' { $$ = buildCReg($2, $4); }
    ;

GateDeclaration
    : GATE Id GateScope BitList GateBody
      {
        $$ = {
            name: $Id,
            bitList: $BitList,
            body: $GateBody
        };
      }
    | GATE Id GateScope '(' ')' BitList GateBody
      {
        $$ = {
            name: $Id,
            bitList: $BitList,
            body: $GateBody
        };
      }
    | GATE Id GateScope '(' GateIdList ')' BitList GateBody
      {
        $$ = {
            name: $Id,
            params: $GateIdList,
            bitList: $BitList,
            body: $GateBody
        };
      }
    ;

GateIdList
    : Gate { $$ = [ $1 ]; }
    | GateIdList ',' Gate
      {
        $$ = $GateIdList;
        $$.push($Gate);
      }
    ;

Gate
    : Id
    ;

    // TODO: empty in the source ???
GateScope
    :
    ;

BitList
    : Bit { $$ = [ $1 ]; }
    | BitList ',' Bit
      {
        $$ = $BitList;
        $$.push($Bit);
      }
    ;

Bit
    : Id
    ;

GateBody
    : '{' GateOpList '}' { $$ = $GateOpList; }
    | '{' '}'
    ;

GateOpList
    : GateOp { $$ = [ $1 ]; }
    | GateOpList GateOp
      {
        $$ = $GateOpList;
        $$.push($GateOp);
      }
    ;

GateOp
    : U '(' ExpList ')' Id ';' { $$ = buildGate('u', [ $Id ], $ExpList, qelibParsed); }
    | CX Id ',' Id ';' { $$ = buildGate('cx', [$2, $4], null, qelibParsed); }
    | Id IdList ';' { $$ = buildGate($Id, $IdList, null, qelibParsed); }
    | Id '(' ')' IdList ';' { $$ = buildGate($Id, $IdList, null, qelibParsed); }
    | Id '(' ExpList ')' IdList ';' { $$ = buildGate($Id, $IdList, $ExpList, qelibParsed); }
    | BARRIER IdList ';' { $$ = buildBarrier($IdList); }
    ;

ExpList
    : Expression { $$ = [ $1 ]; }
    | ExpList ',' Expression
      {
        $$ = $ExpList;
        $$.push($Expression);
      }
    ;

Expression
    : MultiplicativeExpression
    | Expression '^' MultiplicativeExpression { $$ = `${$1}^${$3}`; }
    ;

MultiplicativeExpression
    : AdditiveExpression
    | MultiplicativeExpression '*' MultiplicativeExpression { $$ = `${$1}*${$3}`; }
    | MultiplicativeExpression '/' MultiplicativeExpression { $$ = `${$1}/${$3}`; }
    ;

AdditiveExpression
    : PrefixExpression
    | AdditiveExpression '+' AdditiveExpression { $$ = `${$1}+${$3}`; }
    | AdditiveExpression '-' AdditiveExpression { $$ = `${$1}-${$3}`; }
    ;

PrefixExpression
    : Unary
    | '+' PrefixExpression {  $$ = `+${$PrefixExpression}`; }
    | '-' PrefixExpression {  $$ = `-${$PrefixExpression}`; }
    ;

Unary
    : INT
    | REAL
    | PI
    | Id
    | '(' Expression ')' { $$ = $2; }
    // | Id '(' Expression ')'
    | Id '(' Expression ')'
      {
        if (!lodash.includes(externalFuncs, $Id)) {
            launchError(@Id.first_line, `Illegal external function call: ${$Id}`);
        }

        $$ = `${$Expression}(${$Id})`;
      }
    ;

QOperation
    : UnitaryOperation
    | Opaque
    | Measure
    | Barrier
    | Reset
    // | if
    ;

UnitaryOperation
    : U '(' ExprList ')' Primary ';' { $$ = buildGate('u', [ $Primary ], $ExpList, qelibParsed); }
    | CX Primary ',' Primary { $$ = buildGate($1, [ $2, $4 ], null, qelibParsed); }
    | Id PrimaryList { $$ = buildGate($Id, $PrimaryList, null, qelibParsed); }
    | Id '(' ')' PrimaryList { $$ = buildGate($Id, $PrimaryList, null, qelibParsed); }
    | Id '(' ExpressionList ')' PrimaryList { $$ = buildGate($Id, $PrimaryList, $ExpressionList, qelibParsed); }
    ;


Primary
    : Id { $$ = { name: $Id }; }
    | IndexedId
    ;

Id
    : ID
    ;

PrimaryList
    : Primary { $$ = [ $1 ]; }
    | PrimaryList ',' Primary
      {
        $$ = $PrimaryList;
        $$.push($Primary);
      }
    ;

IndexedId
    : ID '[' INT ']'
      {
        $$ = {
          name: $ID,
          index: $INT
        };
      }
    ;

Barrier
    : BARRIER PrimaryList { $$ = buildBarrier($2); }
    ;

Measure
    : MEASURE Primary '->' Primary { $$ = buildMeasure($2, $4); }
    ;

IdList
    : Id { $$ = [ $1 ]; }
    | IdList ',' Id
      {
        $$ = $IdList;
        $$.push($Id);
      }
    ;

Reset
    : RESET Primary { $$ = buildReset($2); }
    ;

Opaque
    : OPAQUE Id GateScope BitList { $$ = buildOpaque($Id, $GateScope, $BitList); }
    | OPAQUE Id GateScope '(' ')' BitList { $$ = buildOpaque($Id, $GateScope, $BitList); }
    | OPAQUE Id GateScope '(' GateIdList ')' BitList { $$ = buildOpaque($Id, $GateScope, $BitList, $GateIdList); }
    ;

