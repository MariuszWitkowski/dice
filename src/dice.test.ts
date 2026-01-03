import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { init, rollDice } from './dice';

const MockGraphics = {
    clear: vi.fn(),
    fillStyle: vi.fn(),
    lineStyle: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fillPath: vi.fn(),
};

// Mock registry to handle scene-level events/data
const registryMock = {
    _data: new Map(),
    set: vi.fn((key, value) => registryMock._data.set(key, value)),
    get: vi.fn((key) => registryMock._data.get(key)),
    has: vi.fn((key) => registryMock._data.has(key)),
    clear: () => {
        registryMock._data.clear();
        registryMock.set.mockClear();
        registryMock.get.mockClear();
        registryMock.has.mockClear();
    }
};

let lastScene: any;

vi.mock('phaser', () => ({
  default: {
    Game: vi.fn().mockImplementation((config) => {
      lastScene = new config.scene[0]();
      lastScene.add = {
        graphics: () => MockGraphics,
        container: () => ({
            add: vi.fn(),
            destroy: vi.fn(),
            getAt: vi.fn().mockReturnValue(MockGraphics),
            setPosition: vi.fn(),
            setAngle: vi.fn(),
            setData: vi.fn(),
            getData: vi.fn(),
        }),
    };
      lastScene.scale = { on: vi.fn() };
      lastScene.registry = registryMock;
      lastScene.sys = { canvas: { width: 400, height: 400 } };
      lastScene.tweens = {
        add: vi.fn((config) => {
            if (config.onComplete) {
                config.onComplete();
            }
        }),
    };

      // Manually call create to simulate Phaser's lifecycle
      lastScene.create();

      return {
        destroy: vi.fn(),
        scene: {
          getScene: vi.fn().mockReturnValue(lastScene),
        },
      };
    }),
    Scene: vi.fn(),
    AUTO: 1,
    Scale: {
      FIT: 'FIT',
      CENTER_BOTH: 'CENTER_BOTH',
    },
    Math: {
        Between: vi.fn((min, max) => (min + max) / 2),
    },
  }
}));


describe('dice', () => {
    beforeEach(() => {
        const dom = new JSDOM('<!DOCTYPE html><html><body><div id="game-container"></div></body></html>');
        global.document = dom.window.document;
        global.window = dom.window as unknown as Window & typeof globalThis;

        registryMock.clear();
        vi.clearAllMocks();

        init();

        // Reset mocks after initial draw to isolate test actions
        Object.values(MockGraphics).forEach(mockFn => {
            if (vi.isMockFunction(mockFn)) {
                mockFn.mockClear();
            }
        });
    });

    it('should initialize a new Phaser Game', async () => {
        const Phaser = (await import('phaser')).default;
        expect(Phaser.Game).toHaveBeenCalledTimes(1);
    });

    it('should call drawing functions when rollDice is executed for a single die', () => {
        rollDice(1);
        expect(lastScene.currentFaces.length).toBe(1);
        // drawDiceFace is called twice per die during roll (before and after animation)
        expect(MockGraphics.clear).toHaveBeenCalledTimes(2);
        expect(MockGraphics.fillRect).toHaveBeenCalledTimes(2);
        expect(MockGraphics.strokeRect).toHaveBeenCalledTimes(2);
        expect(MockGraphics.fillPath).toHaveBeenCalled();
    });

    it('should call drawing functions for each die when rolling multiple dice', () => {
        const numDice = 4;
        rollDice(numDice);
        expect(lastScene.currentFaces.length).toBe(numDice);
        // drawDiceFace is called twice per die during roll (before and after animation)
        const expectedCalls = numDice * 2;
        expect(MockGraphics.clear).toHaveBeenCalledTimes(expectedCalls);
        expect(MockGraphics.fillRect).toHaveBeenCalledTimes(expectedCalls);
        expect(MockGraphics.strokeRect).toHaveBeenCalledTimes(expectedCalls);
        // Each die should have at least one pip
        expect(MockGraphics.fillPath.mock.calls.length).toBeGreaterThanOrEqual(expectedCalls);
    });
});
