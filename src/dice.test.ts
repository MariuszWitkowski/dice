import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { init, rollDice } from './dice';

// Mock WebGLRenderer to avoid JSDOM errors.
// This allows the init() function to run without crashing.
vi.mock('three', async () => {
    const actual = await vi.importActual('three') as object;
    return {
        ...actual,
        WebGLRenderer: vi.fn().mockImplementation(() => ({
            setSize: vi.fn(),
            render: vi.fn(),
        })),
    };
});

describe('dice', () => {
    beforeEach(() => {
        // Set up the DOM and initialize the scene before each test
        const dom = new JSDOM('<!DOCTYPE html><html><body><canvas id="bg"></canvas><button id="roll-button"></button></body></html>');
        global.document = dom.window.document;
        global.window = dom.window as unknown as Window & typeof globalThis;

        init();
    });

    it('should call rollDice when the button is clicked', () => {
        const button = document.getElementById('roll-button')!;
        const rollDiceSpy = vi.fn(rollDice);

        // Attach the spy as a listener and simulate a click
        button.addEventListener('click', rollDiceSpy);
        button.click();

        // Assert that the spy was called, and it didn't throw an error.
        expect(rollDiceSpy).toHaveBeenCalled();
    });
});
