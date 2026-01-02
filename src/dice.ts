import Phaser from 'phaser';

let game: Phaser.Game | null = null;

class DiceScene extends Phaser.Scene {
    graphics!: Phaser.GameObjects.Graphics;
    currentFace: number = 1;

    constructor() {
        super({ key: 'DiceScene' });
    }

    create() {
        this.graphics = this.add.graphics();
        this.scale.on('resize', this.redraw, this);
        this.registry.set('rollDice', () => this.roll());
        this.redraw(); // Initial draw
    }

    roll() {
        this.currentFace = Math.floor(Math.random() * 6) + 1;
        this.redraw();
    }

    redraw() {
        // Pass the current face to the drawing function
        this.drawDice(this.currentFace);
    }

    drawDice(face: number) {
        const { width, height } = this.sys.canvas;
        const minDim = Math.min(width, height);

        // Dynamic sizing
        const DICE_SIZE = minDim * 0.7; // 70% of the smallest dimension
        const PADDING = (minDim - DICE_SIZE) / 2;
        const PIP_RADIUS = DICE_SIZE / 12;

        // Center the drawing area
        const offsetX = (width - minDim) / 2;
        const offsetY = (height - minDim) / 2;

        this.graphics.clear();

        // Draw dice body
        this.graphics.fillStyle(0xffffff, 1);
        this.graphics.lineStyle(2, 0x000000, 1);
        this.graphics.fillRect(offsetX + PADDING, offsetY + PADDING, DICE_SIZE, DICE_SIZE);
        this.graphics.strokeRect(offsetX + PADDING, offsetY + PADDING, DICE_SIZE, DICE_SIZE);

        this.graphics.fillStyle(0x000000, 1);

        const pipPositions = {
            center: { x: offsetX + PADDING + DICE_SIZE / 2, y: offsetY + PADDING + DICE_SIZE / 2 },
            topLeft: { x: offsetX + PADDING + DICE_SIZE / 4, y: offsetY + PADDING + DICE_SIZE / 4 },
            topRight: { x: offsetX + PADDING + (DICE_SIZE * 3) / 4, y: offsetY + PADDING + DICE_SIZE / 4 },
            bottomLeft: { x: offsetX + PADDING + DICE_SIZE / 4, y: offsetY + PADDING + (DICE_SIZE * 3) / 4 },
            bottomRight: { x: offsetX + PADDING + (DICE_SIZE * 3) / 4, y: offsetY + PADDING + (DICE_SIZE * 3) / 4 },
            middleLeft: { x: offsetX + PADDING + DICE_SIZE / 4, y: offsetY + PADDING + DICE_SIZE / 2 },
            middleRight: { x: offsetX + PADDING + (DICE_SIZE * 3) / 4, y: offsetY + PADDING + DICE_SIZE / 2 },
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

export function rollDice() {
    if (game) {
        const scene = game.scene.getScene('DiceScene');
        if (scene && scene.registry.has('rollDice')) {
            scene.registry.get('rollDice')();
        }
    }
}
