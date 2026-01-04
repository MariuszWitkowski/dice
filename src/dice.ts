import Phaser from 'phaser';
import { Dice3D } from './dice-3d';

let game: Phaser.Game | null = null;

class DiceScene extends Phaser.Scene {
    dice: Dice3D[] = [];
    currentFaces: number[] = [1]; // Start with one die showing 1

    constructor() {
        super({ key: 'DiceScene' });
    }

    create() {
        this.scale.on('resize', () => this.redraw(true), this);
        this.registry.set('rollDice', (numDice: number) => this.roll(numDice));
        this.redraw(false); // Initial draw
    }

    roll(numDice: number) {
        this.currentFaces = [];
        for (let i = 0; i < numDice; i++) {
            this.currentFaces.push(Math.floor(Math.random() * 6) + 1);
        }

        // Ensure we have the correct number of dice objects
        const diceNeeded = numDice - this.dice.length;
        if (diceNeeded > 0) {
            for (let i = 0; i < diceNeeded; i++) {
                const newDie = this.createDice(this.dice.length);
                this.dice.push(newDie);
            }
        } else if (diceNeeded < 0) {
            this.dice.splice(numDice).forEach(die => die.destroy());
        }

        // reposition remaining dice
        this.dice.forEach((die, index) => {
            this.layoutDice(die, index, this.dice.length);
        });

        this.dice.forEach((die, index) => {
            die.roll(this.currentFaces[index]);
        });
    }

    redraw(isResize: boolean) {
        const totalDice = this.currentFaces.length;

        // On resize, just re-layout the existing dice
        if (isResize) {
            this.dice.forEach((die, index) => {
                this.layoutDice(die, index, totalDice);
            });
            return;
        }

        // Destroy existing dice before creating new ones
        this.dice.forEach(die => die.destroy());
        this.dice = [];

        this.currentFaces.forEach((face, index) => {
            const die = this.createDice(index);
            this.dice.push(die);
            die.draw(face);
        });
    }

    getLayoutPosition(index: number, totalDice: number): { x: number, y: number } {
        const { width, height } = this.sys.canvas;

        const cols = Math.ceil(Math.sqrt(totalDice));
        const rows = Math.ceil(totalDice / cols);

        const availableWidth = width * 0.8;
        const availableHeight = height * 0.8;

        const cellWidth = availableWidth / cols;
        const cellHeight = availableHeight / rows;

        const col = index % cols;
        const row = Math.floor(index / cols);

        const startX = (width - availableWidth) / 2;
        const startY = (height - availableHeight) / 2;

        const x = startX + col * cellWidth + cellWidth / 2;
        const y = startY + row * cellHeight + cellHeight / 2;

        return { x, y };
    }


    layoutDice(die: Dice3D, index: number, totalDice: number) {
        const pos = this.getLayoutPosition(index, totalDice);
        die.setPosition(pos.x, pos.y);
    }

    createDice(index: number): Dice3D {
        const { width, height } = this.sys.canvas;
        const totalDice = this.currentFaces.length > 0 ? this.currentFaces.length : 1;
        const cols = Math.ceil(Math.sqrt(totalDice));
        const rows = Math.ceil(totalDice / cols);
        const availableWidth = width * 0.8;
        const availableHeight = height * 0.8;
        const cellWidth = availableWidth / cols;
        const cellHeight = availableHeight / rows;
        const DICE_SIZE = Math.min(cellWidth, cellHeight) * 0.5;

        const pos = this.getLayoutPosition(index, totalDice);
        return new Dice3D(this, pos.x, pos.y, DICE_SIZE);
    }
}

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game-container',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: '100%',
        height: '100%',
    },
    scene: [DiceScene],
    backgroundColor: '#ffffff',
};

export function init() {
    if (game) {
        game.destroy(true);
    }
    game = new Phaser.Game(config);
}

export function rollDice(numDice: number) {
    if (game) {
        const scene = game.scene.getScene('DiceScene');
        if (scene && scene.registry.has('rollDice')) {
            scene.registry.get('rollDice')(numDice);
        }
    }
}
