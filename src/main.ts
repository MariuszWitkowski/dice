import { init, rollDice } from './dice';

init();

document.getElementById('roll-button')!.addEventListener('click', rollDice);
