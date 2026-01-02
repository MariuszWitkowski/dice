if (import.meta.env.DEV) {
  import('eruda').then((eruda) => eruda.default.init());
}

import { init, rollDice } from './dice';

init();

document.getElementById('roll-button')!.addEventListener('click', rollDice);
