import Phaser from 'phaser';

let game: Phaser.Game | null = null;

class DiceScene extends Phaser.Scene {
    dice: Phaser.GameObjects.Container[] = [];
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
        const { width, height } = this.sys.canvas;
        this.currentFaces = [];
        for (let i = 0; i < numDice; i++) {
            this.currentFaces.push(Math.floor(Math.random() * 6) + 1);
        }

        // Ensure we have the correct number of dice objects
        const diceNeeded = numDice - this.dice.length;
        if (diceNeeded > 0) {
            for (let i = 0; i < diceNeeded; i++) {
                this.dice.push(this.createDice());
            }
        } else if (diceNeeded < 0) {
            this.dice.splice(numDice).forEach(die => die.destroy());
        }

        this.dice.forEach((die, index) => {
            // Set random starting position and rotation
            die.setPosition(Phaser.Math.Between(-width / 2, width * 1.5), Phaser.Math.Between(-height / 2, height * 1.5));
            die.setAngle(Phaser.Math.Between(0, 360));

            // Force a redraw of the old face before animation
            const oldFace = die.getData('face') || 1;
            this.drawDiceFace(die, oldFace);

            // Get final position
            const targetPos = this.getLayoutPosition(index, numDice);

            this.tweens.add({
                targets: die,
                x: targetPos.x,
                y: targetPos.y,
                angle: 1080 + Phaser.Math.Between(-180, 180), // Spin multiple times
                duration: 1000,
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    die.setAngle(0); // Reset angle
                    this.drawDiceFace(die, this.currentFaces[index]);
                }
            });
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
            const die = this.createDice();
            this.dice.push(die);
            this.drawDiceFace(die, face);
            this.layoutDice(die, index, totalDice);
        });
    }

    getLayoutPosition(index: number, totalDice: number): { x: number, y: number } {
        const { width, height } = this.sys.canvas;

        const cols = Math.ceil(Math.sqrt(totalDice));
        const rows = Math.ceil(totalDice / cols);

        const availableWidth = width * 0.9;
        const availableHeight = height * 0.9;

        const cellWidth = availableWidth / cols;
        const cellHeight = availableHeight / rows;

        const col = index % cols;
        const row = Math.floor(index / cols);

        const totalGridWidth = cols * cellWidth;
        const totalGridHeight = rows * cellHeight;

        const startX = (width - totalGridWidth) / 2;
        const startY = (height - totalGridHeight) / 2;

        const cellCenterX = startX + col * cellWidth + cellWidth / 2;
        const cellCenterY = startY + row * cellHeight + cellHeight / 2;

        return { x: cellCenterX, y: cellCenterY };
    }

    layoutDice(die: Phaser.GameObjects.Container, index: number, totalDice: number) {
        const pos = this.getLayoutPosition(index, totalDice);
        die.setPosition(pos.x, pos.y);
    }

    createDice(): Phaser.GameObjects.Container {
        const container = this.add.container(0, 0);
        const graphics = this.add.graphics();
        container.add(graphics);
        return container;
    }

    drawDiceFace(die: Phaser.GameObjects.Container, face: number) {
        const graphics = die.getAt(0) as Phaser.GameObjects.Graphics;
        const { width, height } = this.sys.canvas;
        const totalDice = this.currentFaces.length > 0 ? this.currentFaces.length : 1;
        const cols = Math.ceil(Math.sqrt(totalDice));
        const rows = Math.ceil(totalDice / cols);
        const availableWidth = width * 0.9;
        const availableHeight = height * 0.9;
        const cellWidth = availableWidth / cols;
        const cellHeight = availableHeight / rows;
        const DICE_SIZE = Math.min(cellWidth, cellHeight) * 0.8;
        const PIP_RADIUS = DICE_SIZE / 12;

        graphics.clear();
        die.setData('face', face);

        // Draw dice body
        graphics.fillStyle(0xffffff, 1);
        graphics.lineStyle(2, 0x000000, 1);
        graphics.fillRect(-DICE_SIZE / 2, -DICE_SIZE / 2, DICE_SIZE, DICE_SIZE);
        graphics.strokeRect(-DICE_SIZE / 2, -DICE_SIZE / 2, DICE_SIZE, DICE_SIZE);

        graphics.fillStyle(0x000000, 1);

        const pipPositions = {
            center: { x: 0, y: 0 },
            topLeft: { x: -DICE_SIZE / 4, y: -DICE_SIZE / 4 },
            topRight: { x: DICE_SIZE / 4, y: -DICE_SIZE / 4 },
            bottomLeft: { x: -DICE_SIZE / 4, y: DICE_SIZE / 4 },
            bottomRight: { x: DICE_SIZE / 4, y: DICE_SIZE / 4 },
            middleLeft: { x: -DICE_SIZE / 4, y: 0 },
            middleRight: { x: DICE_SIZE / 4, y: 0 },
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
