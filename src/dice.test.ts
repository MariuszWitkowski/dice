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
      lastScene.add = { graphics: () => MockGraphics };
      lastScene.scale = { on: vi.fn() };
      lastScene.registry = registryMock;
      lastScene.sys = { canvas: { width: 400, height: 400 } };

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
    });

    it('should initialize a new Phaser Game', async () => {
        const Phaser = (await import('phaser')).default;
        expect(Phaser.Game).toHaveBeenCalledTimes(1);
    });

    it('should call drawing functions when rollDice is executed', () => {
        rollDice();
        expect(MockGraphics.clear).toHaveBeenCalled();
        expect(MockGraphics.fillStyle).toHaveBeenCalled();
        expect(MockGraphics.fillRect).toHaveBeenCalled();
        expect(MockGraphics.strokeRect).toHaveBeenCalled();
        expect(MockGraphics.beginPath).toHaveBeenCalled();
        expect(MockGraphics.arc).toHaveBeenCalled();
        expect(MockGraphics.fillPath).toHaveBeenCalled();
    });
});
