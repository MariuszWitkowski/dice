import Phaser from 'phaser';

let game: Phaser.Game | null = null;

class DiceScene extends Phaser.Scene {
    graphics!: Phaser.GameObjects.Graphics;
    currentFaces: number[] = [1]; // Start with one die showing 1

    constructor() {
        super({ key: 'DiceScene' });
    }

    create() {
        this.graphics = this.add.graphics();
        this.scale.on('resize', this.redraw, this);
        this.registry.set('rollDice', (numDice: number) => this.roll(numDice));
        this.redraw(); // Initial draw
    }

    roll(numDice: number) {
        this.currentFaces = [];
        for (let i = 0; i < numDice; i++) {
            this.currentFaces.push(Math.floor(Math.random() * 6) + 1);
        }
        this.redraw();
    }

    redraw() {
        this.graphics.clear();
        const totalDice = this.currentFaces.length;
        this.currentFaces.forEach((face, index) => {
            this.drawDice(face, index, totalDice);
        });
    }

    drawDice(face: number, index: number, totalDice: number) {
        const { width, height } = this.sys.canvas;

        // Grid layout calculations
        const cols = Math.ceil(Math.sqrt(totalDice));
        const rows = Math.ceil(totalDice / cols);

        const availableWidth = width * 0.9;
        const availableHeight = height * 0.9;

        const cellWidth = availableWidth / cols;
        const cellHeight = availableHeight / rows;

        const DICE_SIZE = Math.min(cellWidth, cellHeight) * 0.8;
        const PIP_RADIUS = DICE_SIZE / 12;

        const col = index % cols;
        const row = Math.floor(index / cols);

        const totalGridWidth = cols * cellWidth;
        const totalGridHeight = rows * cellHeight;

        const startX = (width - totalGridWidth) / 2;
        const startY = (height - totalGridHeight) / 2;

        const cellCenterX = startX + col * cellWidth + cellWidth / 2;
        const cellCenterY = startY + row * cellHeight + cellHeight / 2;

        const diceX = cellCenterX - DICE_SIZE / 2;
        const diceY = cellCenterY - DICE_SIZE / 2;


        // Draw dice body
        this.graphics.fillStyle(0xffffff, 1);
        this.graphics.lineStyle(2, 0x000000, 1);
        this.graphics.fillRect(diceX, diceY, DICE_SIZE, DICE_SIZE);
        this.graphics.strokeRect(diceX, diceY, DICE_SIZE, DICE_SIZE);

        this.graphics.fillStyle(0x000000, 1);

        const pipPositions = {
            center: { x: diceX + DICE_SIZE / 2, y: diceY + DICE_SIZE / 2 },
            topLeft: { x: diceX + DICE_SIZE / 4, y: diceY + DICE_SIZE / 4 },
            topRight: { x: diceX + (DICE_SIZE * 3) / 4, y: diceY + DICE_SIZE / 4 },
            bottomLeft: { x: diceX + DICE_SIZE / 4, y: diceY + (DICE_SIZE * 3) / 4 },
            bottomRight: { x: diceX + (DICE_SIZE * 3) / 4, y: diceY + (DICE_SIZE * 3) / 4 },
            middleLeft: { x: diceX + DICE_SIZE / 4, y: diceY + DICE_SIZE / 2 },
            middleRight: { x: diceX + (DICE_SIZE * 3) / 4, y: diceY + DICE_SIZE / 2 },
        };

        const drawPip = (pos: { x: number; y: number }) => {
            this.graphics.beginPath();
            this.graphics.arc(pos.x, pos.y, PIP_RADIUS, 0, Math.PI * 2);
            this.graphics.fillPath();
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
