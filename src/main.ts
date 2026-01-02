
import { init, rollDice } from './dice';

document.addEventListener('DOMContentLoaded', () => {
  init();
});

document.getElementById('roll-button')!.addEventListener('click', rollDice);
