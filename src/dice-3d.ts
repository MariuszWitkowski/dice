import Phaser from 'phaser';

export class Dice3D {
    private scene: Phaser.Scene;
    private container: Phaser.GameObjects.Container;
    private face = 1;
    private size: number;
    private faceGraphics: { [key: string]: Phaser.GameObjects.Graphics } = {};

    constructor(scene: Phaser.Scene, x: number, y: number, size: number) {
        this.scene = scene;
        this.size = size;
        this.container = this.scene.add.container(x, y);

        // Create graphics objects once
        this.faceGraphics.left = this.scene.add.graphics();
        this.faceGraphics.right = this.scene.add.graphics();
        this.faceGraphics.top = this.scene.add.graphics();
        this.container.add([this.faceGraphics.left, this.faceGraphics.right, this.faceGraphics.top]);

        this.draw(1);
    }

    draw(face: number) {
        this.face = face;

        // Clear old drawings
        Object.values(this.faceGraphics).forEach(g => g.clear());

        const halfSize = this.size / 2;

        // Isometric projection angles
        const angleX = Math.cos(Phaser.Math.DegToRad(30));
        const angleY = Math.sin(Phaser.Math.DegToRad(30));

        // Define the 8 vertices of the cube in 3D space
        const vertices = [
            { x: -halfSize, y: -halfSize, z: -halfSize },
            { x: halfSize, y: -halfSize, z: -halfSize },
            { x: halfSize, y: halfSize, z: -halfSize },
            { x: -halfSize, y: halfSize, z: -halfSize },
            { x: -halfSize, y: -halfSize, z: halfSize },
            { x: halfSize, y: -halfSize, z: halfSize },
            { x: halfSize, y: halfSize, z: halfSize },
            { x: -halfSize, y: halfSize, z: halfSize },
        ];

        // Project the 3D vertices to 2D screen coordinates
        const projected = vertices.map(v => ({
            x: (v.x - v.y) * angleX,
            y: (v.x + v.y) * angleY - v.z,
        }));

        // Draw the faces of the cube
        this.drawFacePolygon(this.faceGraphics.left, [projected[0], projected[1], projected[5], projected[4]], 0x767676); // Left face
        this.drawFacePolygon(this.faceGraphics.right, [projected[1], projected[2], projected[6], projected[5]], 0xb2b2b2); // Right face
        this.drawFacePolygon(this.faceGraphics.top, [projected[4], projected[5], projected[6], projected[7]], 0xefefef, face); // Top face
    }

    private drawFacePolygon(graphics: Phaser.GameObjects.Graphics, points: {x: number, y: number}[], color: number, face?: number) {
        graphics.fillStyle(color, 1);
        graphics.lineStyle(2, 0x000000, 1);
        graphics.beginPath();
        graphics.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            graphics.lineTo(points[i].x, points[i].y);
        }
        graphics.closePath();
        graphics.fillPath();
        graphics.strokePath();

        if (face) {
            this.drawPips(graphics, face, points);
        }
    }

    private drawPips(graphics: Phaser.GameObjects.Graphics, face: number, points: {x: number, y: number}[]) {
        graphics.fillStyle(0x000000, 1);
        const pipRadius = this.size / 12;

        const centerX = (points[0].x + points[2].x) / 2;
        const centerY = (points[0].y + points[2].y) / 2;

        const positions = this.getPipPositions(face, centerX, centerY, this.size / 2);
        positions.forEach(pos => {
            graphics.fillCircle(pos.x, pos.y, pipRadius);
        });
    }

    private getPipPositions(face: number, cx: number, cy: number, d: number): { x: number, y: number }[] {
        const pips = {
            1: [{ x: cx, y: cy }],
            2: [{ x: cx - d/2, y: cy - d/2 }, { x: cx + d/2, y: cy + d/2 }],
            3: [{ x: cx - d/2, y: cy + d/2 }, { x: cx, y: cy }, { x: cx + d/2, y: cy - d/2 }],
            4: [{ x: cx - d/2, y: cy - d/2 }, { x: cx + d/2, y: cy - d/2 }, { x: cx - d/2, y: cy + d/2 }, { x: cx + d/2, y: cy + d/2 }],
            5: [{ x: cx - d/2, y: cy - d/2 }, { x: cx + d/2, y: cy - d/2 }, { x: cx, y: cy }, { x: cx - d/2, y: cy + d/2 }, { x: cx + d/2, y: cy + d/2 }],
            6: [{ x: cx - d/2, y: cy - d/2 }, { x: cx + d/2, y: cy - d/2 }, { x: cx - d/2, y: cy }, { x: cx + d/2, y: cy }, { x: cx - d/2, y: cy + d/2 }, { x: cx + d/2, y: cy + d/2 }],
        };
        return pips[face] || [];
    }

    setPosition(x: number, y: number) {
        this.container.setPosition(x, y);
    }

    roll(finalFace: number) {
        const duration = 1000;
        const halfDuration = duration / 2;

        this.scene.tweens.add({
            targets: this.container,
            y: this.container.y - this.size,
            duration: halfDuration,
            ease: 'Cubic.easeOut',
            yoyo: true,
            onUpdate: () => {
                this.draw(Math.floor(Math.random() * 6) + 1);
            },
            onComplete: () => {
                this.draw(finalFace);
            }
        });
    }

    destroy() {
        this.container.destroy();
    }
}
