import { init, rollDice } from './dice';

init();

document.getElementById('roll-button')!.addEventListener('click', () => {
    const selector = document.getElementById('dice-selector') as HTMLSelectElement;
    const numDice = parseInt(selector.value, 10);
    rollDice(numDice);
});
