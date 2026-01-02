import('eruda').then((eruda) => eruda.default.init());

import { version } from '../package.json';
import { init, rollDice } from './dice';

init();

document.getElementById('roll-button')!.addEventListener('click', rollDice);

const versionElement = document.getElementById('version');
if (versionElement) {
  versionElement.innerText = `v${version}`;
}
