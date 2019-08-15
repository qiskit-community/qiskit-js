import sim from '@qiskit/sim'

function component() {
  const element = document.createElement('div');
  element.innerHTML = `@Qiskit/sim: ${sim.version}`;
  return element;
}

document.body.appendChild(component());
