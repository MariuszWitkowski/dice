import { init, rollDice, toggle3D } from './dice';

init();

document.getElementById('roll-button')!.addEventListener('click', () => {
    const selector = document.getElementById('dice-selector') as HTMLSelectElement;
    const numDice = parseInt(selector.value, 10);
    rollDice(numDice);
});

document.getElementById('3d-checkbox')!.addEventListener('change', (event) => {
    const checkbox = event.target as HTMLInputElement;
    toggle3D(checkbox.checked);
});
