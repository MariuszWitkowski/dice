import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Dice3D } from '../src/dice-3d';

vi.mock('../src/dice-3d', () => ({
    Dice3D: vi.fn(() => ({
        destroy: vi.fn(),
        draw: vi.fn(),
        setPosition: vi.fn(),
        roll: vi.fn(),
    })),
}));

const mockGraphics = {
    clear: vi.fn().mockReturnThis(),
    fillStyle: vi.fn().mockReturnThis(),
    lineStyle: vi.fn().mockReturnThis(),
    fillRect: vi.fn().mockReturnThis(),
    strokeRect: vi.fn().mockReturnThis(),
    beginPath: vi.fn().mockReturnThis(),
    arc: vi.fn().mockReturnThis(),
    fillPath: vi.fn().mockReturnThis(),
};

const mockContainer = {
    add: vi.fn(),
    destroy: vi.fn(),
    getAt: vi.fn().mockReturnValue(mockGraphics),
    setPosition: vi.fn(),
    setAngle: vi.fn(),
    setData: vi.fn(),
    getData: vi.fn(),
};

vi.mock('phaser', () => {
    const mockSceneInstance = {
        sys: { canvas: { width: 800, height: 600 } },
        scale: { on: vi.fn() },
        registry: { set: vi.fn(), get: vi.fn(), has: vi.fn(() => true) },
        add: {
            graphics: vi.fn(() => mockGraphics),
            container: vi.fn(() => mockContainer),
        },
        tweens: { add: vi.fn() },
    };

    const Scene = vi.fn(function() {
        Object.assign(this, mockSceneInstance);
    });

    const Game = vi.fn(config => {
        const scene = new config.scene[0]();
        scene.create();
        return {
            destroy: vi.fn(),
            scene: {
                getScene: vi.fn(() => scene),
            },
        };
    });

    return {
        default: {
            Game,
            Scene,
            Scale: { FIT: 1, CENTER_BOTH: 1 },
            AUTO: 0,
            Math: { Between: vi.fn(() => 0) },
        },
        Game,
        Scene,
        Scale: { FIT: 1, CENTER_BOTH: 1 },
        AUTO: 0,
        Math: { Between: vi.fn(() => 0) },
    };
});

describe('Dice Roller', () => {
    let init, rollDice, toggle3D;
    let Phaser;

    beforeEach(async () => {
        vi.clearAllMocks();
        vi.resetModules();

        const diceModule = await import('../src/dice');
        init = diceModule.init;
        rollDice = diceModule.rollDice;
        toggle3D = diceModule.toggle3D;

        Phaser = (await import('phaser')).default;
    });

    it('should initialize the game', () => {
        init();
        expect(Phaser.Game).toHaveBeenCalled();
    });

    it('should call rollDice on the scene', () => {
        init();
        const gameInstance = Phaser.Game.mock.results[0].value;
        const sceneInstance = gameInstance.scene.getScene();
        const rollDiceFn = vi.fn();
        sceneInstance.registry.get.mockReturnValue(rollDiceFn);

        rollDice(3);

        expect(sceneInstance.registry.get).toHaveBeenCalledWith('rollDice');
        expect(rollDiceFn).toHaveBeenCalledWith(3);
    });

    it('should call toggle3D on the scene', () => {
        init();
        const gameInstance = Phaser.Game.mock.results[0].value;
        const sceneInstance = gameInstance.scene.getScene();
        const toggle3DFn = vi.fn();
        sceneInstance.registry.get.mockReturnValue(toggle3DFn);

        toggle3D(false);

        expect(sceneInstance.registry.get).toHaveBeenCalledWith('toggle3D');
        expect(toggle3DFn).toHaveBeenCalledWith(false);
    });
});
