import { describe, it, expect, vi, beforeEach } from 'vitest';
import { init, rollDice } from '../src/dice';
import { Dice3D } from '../src/dice-3d';

// Mock Dice3D
vi.mock('../src/dice-3d', () => ({
    Dice3D: vi.fn(() => ({
        destroy: vi.fn(),
        draw: vi.fn(),
        setPosition: vi.fn(),
        roll: vi.fn(),
    })),
}));

// Manually mock Phaser directly in the test file
const mockScene = {
    sys: {
        canvas: {
            width: 800,
            height: 600,
        },
    },
    registry: {
        set: vi.fn(),
        get: vi.fn(),
        has: vi.fn(() => true),
    },
    scale: {
        on: vi.fn(),
    },
    add: {
        graphics: vi.fn(),
        container: vi.fn(),
    },
    tweens: {
        add: vi.fn(),
    },
};

const mockGame = {
    scene: {
        getScene: vi.fn(() => mockScene),
    },
    destroy: vi.fn(),
};

vi.mock('phaser', () => ({
    default: {
        Game: vi.fn(() => mockGame),
        Scene: vi.fn(() => mockScene),
        Scale: {
            FIT: 1,
            CENTER_BOTH: 1,
        },
        AUTO: 0,
    },
    Game: vi.fn(() => mockGame),
    Scene: vi.fn(() => mockScene),
    Scale: {
        FIT: 1,
        CENTER_BOTH: 1,
    },
    AUTO: 0,
}));

describe('Dice Roller', () => {
    beforeEach(() => {
        // Reset mocks before each test
        vi.clearAllMocks();
    });

    it('should initialize the game', () => {
        const Phaser = require('phaser');
        init();
        expect(Phaser.Game).toHaveBeenCalled();
    });

    it('should call rollDice on the scene', () => {
        const Phaser = require('phaser');
        init();
        const gameInstance = (Phaser.Game as any).mock.instances[0];
        const sceneInstance = gameInstance.scene.getScene();
        const rollDiceFn = vi.fn();
        sceneInstance.registry.get.mockReturnValue(rollDiceFn);

        rollDice(3);

        expect(sceneInstance.registry.get).toHaveBeenCalledWith('rollDice');
        expect(rollDiceFn).toHaveBeenCalledWith(3);
    });
});
