import Phaser from 'phaser';

let game: Phaser.Game | null = null;
export let graphics: Phaser.GameObjects.Graphics; // Export for testing
const DICE_SIZE = 100;
const PIP_RADIUS = 8;
const PADDING = 20;

class DiceScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DiceScene' });
    }

    create() {
        graphics = this.add.graphics();
        drawDice(1); // Start with face 1
    }
}

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: DICE_SIZE + PADDING * 2,
    height: DICE_SIZE + PADDING * 2,
    parent: 'game-container',
    scene: [DiceScene],
    backgroundColor: '#ffffff',
};

export function init() {
    if (game) {
        game.destroy(true);
    }
    game = new Phaser.Game(config);
}

export function rollDice() {
    const randomFace = Math.floor(Math.random() * 6) + 1;
    drawDice(randomFace);
}

function drawDice(face: number) {
    if (!graphics) return;

    graphics.clear();

    // Draw dice body
    graphics.fillStyle(0xffffff, 1);
    graphics.lineStyle(2, 0x000000, 1);
    graphics.fillRect(PADDING, PADDING, DICE_SIZE, DICE_SIZE);
    graphics.strokeRect(PADDING, PADDING, DICE_SIZE, DICE_SIZE);


    graphics.fillStyle(0x000000, 1);

    const pipPositions = {
        center: { x: PADDING + DICE_SIZE / 2, y: PADDING + DICE_SIZE / 2 },
        topLeft: { x: PADDING + DICE_SIZE / 4, y: PADDING + DICE_SIZE / 4 },
        topRight: { x: PADDING + (DICE_SIZE * 3) / 4, y: PADDING + DICE_SIZE / 4 },
        bottomLeft: { x: PADDING + DICE_SIZE / 4, y: PADDING + (DICE_SIZE * 3) / 4 },
        bottomRight: { x: PADDING + (DICE_SIZE * 3) / 4, y: PADDING + (DICE_SIZE * 3) / 4 },
        middleLeft: { x: PADDING + DICE_SIZE / 4, y: PADDING + DICE_SIZE / 2 },
        middleRight: { x: PADDING + (DICE_SIZE * 3) / 4, y: PADDING + DICE_SIZE / 2 },
    };

    const drawPip = (pos: { x: number; y: number }) => {
        graphics.beginPath();
        graphics.arc(pos.x, pos.y, PIP_RADIUS, 0, Math.PI * 2);
        graphics.fillPath();
    };

    switch (face) {
        case 1:
            drawPip(pipPositions.center);
            break;
        case 2:
            drawPip(pipPositions.topLeft);
            drawPip(pipPositions.bottomRight);
            break;
        case 3:
            drawPip(pipPositions.topLeft);
            drawPip(pipPositions.center);
            drawPip(pipPositions.bottomRight);
            break;
        case 4:
            drawPip(pipPositions.topLeft);
            drawPip(pipPositions.topRight);
            drawPip(pipPositions.bottomLeft);
            drawPip(pipPositions.bottomRight);
            break;
        case 5:
            drawPip(pipPositions.topLeft);
            drawPip(pipPositions.topRight);
            drawPip(pipPositions.center);
            drawPip(pipPositions.bottomLeft);
            drawPip(pipPositions.bottomRight);
            break;
        case 6:
            drawPip(pipPositions.topLeft);
            drawPip(pipPositions.topRight);
            drawPip(pipPositions.middleLeft);
            drawPip(pipPositions.middleRight);
            drawPip(pipPositions.bottomLeft);
            drawPip(pipPositions.bottomRight);
            break;
    }
}
