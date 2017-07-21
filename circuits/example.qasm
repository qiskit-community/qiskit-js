
OPENQASM 2.0;
// include "qelib1.inc";
qreg q[3];
qreg r[3];
h q;
// Should error: Undefined gate
//uu q;

// Should error: too many params
//h q a

// Should error: no ;
// h q
cx q, r;
// cx q[0], r[2];
creg c[3];
creg d[3];
barrier q;
// barrier q[0];
// barrier q[0],q[1];
measure q->c;
// measure q[0]->c[0];
measure r->d;
