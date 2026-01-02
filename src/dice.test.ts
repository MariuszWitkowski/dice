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

let lastScene: any;

vi.mock('phaser', () => ({
  default: {
    Game: vi.fn().mockImplementation((config) => {
      lastScene = new config.scene[0]();
      lastScene.add = {
        graphics: () => MockGraphics,
      };
      // Manually call create to simulate Phaser's lifecycle
      lastScene.create();
      return {
        destroy: vi.fn(),
      };
    }),
    Scene: vi.fn(function(this: any) {
      // Don't need to do anything here, since we're creating the scene manually
    }),
    AUTO: 1,
  }
}));


describe('dice', () => {
    beforeEach(() => {
        const dom = new JSDOM('<!DOCTYPE html><html><body><div id="game-container"></div></body></html>');
        global.document = dom.window.document;
        global.window = dom.window as unknown as Window & typeof globalThis;

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
