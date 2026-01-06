import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockGraphics = {
    clear: vi.fn().mockReturnThis(),
    fillStyle: vi.fn().mockReturnThis(),
    lineStyle: vi.fn().mockReturnThis(),
    beginPath: vi.fn().mockReturnThis(),
    moveTo: vi.fn().mockReturnThis(),
    lineTo: vi.fn().mockReturnThis(),
    closePath: vi.fn().mockReturnThis(),
    fillPath: vi.fn().mockReturnThis(),
    strokePath: vi.fn().mockReturnThis(),
    fillCircle: vi.fn().mockReturnThis(),
};

const mockContainer = {
    add: vi.fn(),
    destroy: vi.fn(),
    setPosition: vi.fn(),
    y: 0,
};

const mockScene = {
    add: {
        graphics: vi.fn(() => mockGraphics),
        container: vi.fn(() => mockContainer),
    },
    tweens: {
        add: vi.fn(),
    },
};

vi.mock('phaser', () => ({
    default: {
        Scene: vi.fn(() => mockScene),
        GameObjects: {
            Graphics: vi.fn(() => mockGraphics),
            Container: vi.fn(() => mockContainer),
        },
        Math: {
            DegToRad: (deg: number) => deg * (Math.PI / 180),
        },
    },
    Scene: vi.fn(() => mockScene),
    GameObjects: {
        Graphics: vi.fn(() => mockGraphics),
        Container: vi.fn(() => mockContainer),
    },
    Math: {
        DegToRad: (deg: number) => deg * (Math.PI / 180),
    },
}));

describe('Dice3D', () => {
    let Dice3D;
    let sceneMock;
    let Phaser;

    beforeEach(async () => {
        vi.clearAllMocks();
        vi.resetModules();

        Dice3D = (await import('./dice-3d')).Dice3D;
        Phaser = (await import('phaser')).default;
        sceneMock = new Phaser.Scene();
    });

    it('should create a container on construction', () => {
        new Dice3D(sceneMock, 0, 0, 50);
        expect(sceneMock.add.container).toHaveBeenCalledWith(0, 0);
    });

    it('should draw the dice on construction', () => {
        const drawSpy = vi.spyOn(Dice3D.prototype, 'draw');
        new Dice3D(sceneMock, 0, 0, 50);
        expect(drawSpy).toHaveBeenCalledWith(1);
        drawSpy.mockRestore();
    });

    it('should roll the dice', () => {
        const dice = new Dice3D(sceneMock, 0, 0, 50);
        dice.roll(6);
        expect(sceneMock.tweens.add).toHaveBeenCalled();
    });

    it('should destroy the container', () => {
        const dice = new Dice3D(sceneMock, 0, 0, 50);
        const destroySpy = vi.spyOn(dice.container, 'destroy');
        dice.destroy();
        expect(destroySpy).toHaveBeenCalled();
    });
});
