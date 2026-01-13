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
            text: vi.fn(() => ({
                setOrigin: vi.fn().mockReturnThis(),
            })),
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
    let init, rollDice, toggle3D, setNumEdges;
    let Phaser;

    beforeEach(async () => {
        vi.clearAllMocks();
        vi.resetModules();

        const diceModule = await import('../src/dice');
        init = diceModule.init;
        rollDice = diceModule.rollDice;
        toggle3D = diceModule.toggle3D;
        setNumEdges = diceModule.setNumEdges;

        Phaser = (await import('phaser')).default;
    });

    it('should initialize the game', () => {
        const mockContainer = document.createElement('div');
        init(mockContainer);
        expect(Phaser.Game).toHaveBeenCalled();
    });

    it('should call rollDice on the scene', () => {
        const mockContainer = document.createElement('div');
        init(mockContainer);
        const gameInstance = Phaser.Game.mock.results[0].value;
        const sceneInstance = gameInstance.scene.getScene();
        const rollDiceFn = vi.fn();
        sceneInstance.registry.get.mockReturnValue(rollDiceFn);

        rollDice(3, 6);

        expect(sceneInstance.registry.get).toHaveBeenCalledWith('rollDice');
        expect(rollDiceFn).toHaveBeenCalledWith(3, 6);
    });

    it('should call toggle3D on the scene', () => {
        const mockContainer = document.createElement('div');
        init(mockContainer);
        const gameInstance = Phaser.Game.mock.results[0].value;
        const sceneInstance = gameInstance.scene.getScene();
        const toggle3DFn = vi.fn();
        sceneInstance.registry.get.mockReturnValue(toggle3DFn);

        toggle3D(false);

        expect(sceneInstance.registry.get).toHaveBeenCalledWith('toggle3D');
        expect(toggle3DFn).toHaveBeenCalledWith(false);
    });

    it('should call setNumEdges on the scene', () => {
        const mockContainer = document.createElement('div');
        init(mockContainer);
        const gameInstance = Phaser.Game.mock.results[0].value;
        const sceneInstance = gameInstance.scene.getScene();
        const setNumEdgesFn = vi.fn();
        sceneInstance.registry.get.mockImplementation((key) => {
            if (key === 'setNumEdges') return setNumEdgesFn;
            return null;
        });

        setNumEdges(10);

        expect(sceneInstance.registry.get).toHaveBeenCalledWith('setNumEdges');
        expect(setNumEdgesFn).toHaveBeenCalledWith(10);
    });

    it('should update numEdges and redraw when setNumEdges is called', () => {
        const mockContainer = document.createElement('div');
        init(mockContainer);
        const gameInstance = Phaser.Game.mock.results[0].value;
        const sceneInstance = gameInstance.scene.getScene();

        const redrawSpy = vi.spyOn(sceneInstance, 'redraw');

        sceneInstance.setNumEdges(12);

        expect(redrawSpy).toHaveBeenCalledWith(false);

        redrawSpy.mockRestore();
    });

    it('should generate a roll within the correct range', () => {
        const mockContainer = document.createElement('div');
        init(mockContainer);
        const gameInstance = Phaser.Game.mock.results[0].value;
        const sceneInstance = gameInstance.scene.getScene();

        sceneInstance.roll(1, 20);

        expect(sceneInstance.currentFaces).toHaveLength(1);
        const faceValue = sceneInstance.currentFaces[0];
        expect(faceValue).toBeGreaterThanOrEqual(1);
        expect(faceValue).toBeLessThanOrEqual(20);

        sceneInstance.roll(1, 3);
        expect(sceneInstance.currentFaces).toHaveLength(1);
        const faceValueD3 = sceneInstance.currentFaces[0];
        expect(faceValueD3).toBeGreaterThanOrEqual(1);
        expect(faceValueD3).toBeLessThanOrEqual(3);
    });
});
