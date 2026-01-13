import Phaser from 'phaser';
import { Dice3D } from './dice-3d';

let game: Phaser.Game | null = null;

interface IDice {
    destroy: () => void;
    draw: (face: number) => void;
    setPosition: (x: number, y: number) => void;
    roll: (face: number) => void;
}

class Dice2D implements IDice {
    private container: Phaser.GameObjects.Container;
    private graphics: Phaser.GameObjects.Graphics;
    private text: Phaser.GameObjects.Text;
    private scene: Phaser.Scene;
    private size: number;
    private numEdges: number;

    constructor(scene: Phaser.Scene, x: number, y: number, size: number, numEdges: number) {
        this.scene = scene;
        this.size = size;
        this.numEdges = numEdges;
        this.container = scene.add.container(x, y);
        this.graphics = scene.add.graphics();
        this.text = scene.add.text(0, 0, '', {
            fontSize: `${size / 2}px`,
            color: '#000000',
            fontStyle: 'bold',
        }).setOrigin(0.5);
        this.container.add([this.graphics, this.text]);
        this.draw(1);
    }

    draw(face: number) {
        const DICE_SIZE = this.size;

        this.graphics.clear();
        this.container.setData('face', face);

        // Draw dice body
        this.graphics.fillStyle(0xffffff, 1);
        this.graphics.lineStyle(2, 0x000000, 1);
        this.graphics.fillRect(-DICE_SIZE / 2, -DICE_SIZE / 2, DICE_SIZE, DICE_SIZE);
        this.graphics.strokeRect(-DICE_SIZE / 2, -DICE_SIZE / 2, DICE_SIZE, DICE_SIZE);

        if (this.numEdges > 6) {
            this.text.setText(face.toString());
            this.text.setVisible(true);
        } else {
            this.text.setVisible(false);

            const PIP_RADIUS = DICE_SIZE / 12;
            this.graphics.fillStyle(0x000000, 1);

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

    roll(finalFace: number) {
        // Force a redraw of the old face before animation
        const oldFace = this.container.getData('face') || 1;
        this.draw(oldFace);

        this.scene.tweens.add({
            targets: this.container,
            angle: 1080 + Phaser.Math.Between(-180, 180), // Spin multiple times
            duration: 1000,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                this.container.setAngle(0); // Reset angle
                this.draw(finalFace);
            }
        });
    }

    setPosition(x: number, y: number) {
        this.container.setPosition(x, y);
    }

    destroy() {
        this.container.destroy();
    }
}


class DiceScene extends Phaser.Scene {
    dice: IDice[] = [];
    currentFaces: number[] = [1]; // Start with one die showing 1
    is3D: boolean = true;
    private numEdges = 6;

    constructor() {
        super({ key: 'DiceScene' });
    }

    create() {
        this.scale.on('resize', () => this.redraw(true), this);
        this.registry.set('rollDice', (numDice: number, numEdges: number) => this.roll(numDice, numEdges));
        this.registry.set('toggle3D', (is3D: boolean) => this.toggle3D(is3D));
        this.registry.set('setNumEdges', (numEdges: number) => this.setNumEdges(numEdges));
        this.redraw(false); // Initial draw
    }

    setNumEdges(numEdges: number) {
        this.numEdges = numEdges;
        this.redraw(false);
    }

    toggle3D(is3D: boolean) {
        this.is3D = is3D;
        this.redraw(false);
    }

    roll(numDice: number, numEdges: number) {
        this.numEdges = numEdges;
        this.currentFaces = [];
        for (let i = 0; i < numDice; i++) {
            this.currentFaces.push(Math.floor(Math.random() * numEdges) + 1);
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


    layoutDice(die: IDice, index: number, totalDice: number) {
        const pos = this.getLayoutPosition(index, totalDice);
        die.setPosition(pos.x, pos.y);
    }

    createDice(index: number): IDice {
        const { width, height } = this.sys.canvas;
        const totalDice = this.currentFaces.length > 0 ? this.currentFaces.length : 1;
        const cols = Math.ceil(Math.sqrt(totalDice));
        const rows = Math.ceil(totalDice / cols);
        const availableWidth = width * 0.8;
        const availableHeight = height * 0.8;
        const cellWidth = availableWidth / cols;
        const cellHeight = availableHeight / rows;
        const DICE_SIZE_3D = Math.min(cellWidth, cellHeight) * 0.5;
        const DICE_SIZE_2D = Math.min(cellWidth, cellHeight) * 0.8;

        const pos = this.getLayoutPosition(index, totalDice);

        if (this.is3D) {
            return new Dice3D(this, pos.x, pos.y, DICE_SIZE_3D);
        } else {
            return new Dice2D(this, pos.x, pos.y, DICE_SIZE_2D, this.numEdges);
        }
    }
}

export function setNumEdges(numEdges: number) {
    if (game) {
        const scene = game.scene.getScene('DiceScene');
        if (scene && scene.registry.has('setNumEdges')) {
            scene.registry.get('setNumEdges')(numEdges);
        }
    }
}

export function init(container: HTMLDivElement) {
    if (game) {
        game.destroy(true);
    }
    const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
            parent: container,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: '100%',
            height: '100%',
        },
        scene: [DiceScene],
        backgroundColor: '#ffffff',
    };
    game = new Phaser.Game(config);
}

export function rollDice(numDice: number, numEdges: number) {
    if (game) {
        const scene = game.scene.getScene('DiceScene');
        if (scene && scene.registry.has('rollDice')) {
            scene.registry.get('rollDice')(numDice, numEdges);
        }
    }
}

export function toggle3D(is3D: boolean) {
    if (game) {
        const scene = game.scene.getScene('DiceScene');
        if (scene && scene.registry.has('toggle3D')) {
            scene.registry.get('toggle3D')(is3D);
        }
    }
}
