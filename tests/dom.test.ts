import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  createElement,
  resolveElement,
  isBrowser,
  supportsFullscreen,
  requestFullscreen,
  exitFullscreen,
} from '../src/utils/dom';

describe('DOM utilities', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('createElement', () => {
    it('should create an element with the specified tag', () => {
      const el = createElement('div');
      expect(el.tagName).toBe('DIV');
    });

    it('should create an element with a class name', () => {
      const el = createElement('span', 'my-class');
      expect(el.className).toBe('my-class');
    });

    it('should create an element with attributes', () => {
      const el = createElement('img', undefined, {
        src: 'test.jpg',
        alt: 'Test image',
        draggable: 'false',
      });

      expect(el.getAttribute('src')).toBe('test.jpg');
      expect(el.getAttribute('alt')).toBe('Test image');
      expect(el.getAttribute('draggable')).toBe('false');
    });

    it('should create an element with both class and attributes', () => {
      const el = createElement('button', 'btn-primary', {
        type: 'button',
        'aria-label': 'Click me',
      });

      expect(el.className).toBe('btn-primary');
      expect(el.getAttribute('type')).toBe('button');
      expect(el.getAttribute('aria-label')).toBe('Click me');
    });

    it('should create an element without class or attributes', () => {
      const el = createElement('div');
      expect(el.className).toBe('');
      expect(el.attributes.length).toBe(0);
    });

    it('should return the correct element type for known tags', () => {
      const img = createElement('img');
      expect(img).toBeInstanceOf(HTMLImageElement);

      const button = createElement('button');
      expect(button).toBeInstanceOf(HTMLButtonElement);

      const input = createElement('input');
      expect(input).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('resolveElement', () => {
    it('should return the element directly when given an HTMLElement', () => {
      const el = document.createElement('div');
      const result = resolveElement(el);
      expect(result).toBe(el);
    });

    it('should find an element by CSS selector string', () => {
      const result = resolveElement('#test-container');
      expect(result).toBe(container);
    });

    it('should find an element by class selector', () => {
      container.classList.add('unique-class');
      const result = resolveElement('.unique-class');
      expect(result).toBe(container);
    });

    it('should throw an error when the selector matches no element', () => {
      expect(() => resolveElement('#nonexistent-element')).toThrowError(
        'CIBeforeAfter: Element not found for selector "#nonexistent-element"',
      );
    });

    it('should throw an error for an empty selector that matches nothing', () => {
      expect(() => resolveElement('.does-not-exist')).toThrowError(
        'CIBeforeAfter: Element not found for selector ".does-not-exist"',
      );
    });
  });

  describe('isBrowser', () => {
    it('should return true in jsdom environment', () => {
      expect(isBrowser()).toBe(true);
    });
  });

  describe('supportsFullscreen', () => {
    let originalFsDesc: PropertyDescriptor | undefined;

    beforeEach(() => {
      originalFsDesc = Object.getOwnPropertyDescriptor(document, 'fullscreenEnabled');
    });

    afterEach(() => {
      // Restore fullscreenEnabled
      if (originalFsDesc) {
        Object.defineProperty(document, 'fullscreenEnabled', originalFsDesc);
      } else {
        delete (document as any).fullscreenEnabled;
      }
      // Clean up webkit property
      delete (document as any).webkitFullscreenEnabled;
    });

    it('should return true when fullscreenEnabled is true', () => {
      Object.defineProperty(document, 'fullscreenEnabled', {
        value: true,
        configurable: true,
      });

      expect(supportsFullscreen()).toBe(true);
    });

    it('should return true when webkitFullscreenEnabled is true', () => {
      Object.defineProperty(document, 'fullscreenEnabled', {
        value: false,
        configurable: true,
      });
      Object.defineProperty(document, 'webkitFullscreenEnabled', {
        value: true,
        configurable: true,
      });

      expect(supportsFullscreen()).toBe(true);
    });

    it('should return false when no fullscreen API is available', () => {
      Object.defineProperty(document, 'fullscreenEnabled', {
        value: false,
        configurable: true,
      });

      expect(supportsFullscreen()).toBe(false);
    });
  });

  describe('requestFullscreen', () => {
    it('should call requestFullscreen on the element if available', async () => {
      const el = document.createElement('div');
      el.requestFullscreen = vi.fn().mockResolvedValue(undefined);

      await requestFullscreen(el);

      expect(el.requestFullscreen).toHaveBeenCalledTimes(1);
    });

    it('should fall back to webkitRequestFullscreen', async () => {
      const el = document.createElement('div') as HTMLElement & {
        webkitRequestFullscreen?: () => Promise<void>;
      };
      // Remove the standard method
      (el as any).requestFullscreen = undefined;
      el.webkitRequestFullscreen = vi.fn().mockResolvedValue(undefined);

      await requestFullscreen(el);

      expect(el.webkitRequestFullscreen).toHaveBeenCalledTimes(1);
    });

    it('should reject if no fullscreen method is available', async () => {
      const el = document.createElement('div');
      (el as any).requestFullscreen = undefined;

      await expect(requestFullscreen(el)).rejects.toThrow('Fullscreen API not supported');
    });
  });

  describe('exitFullscreen', () => {
    it('should call document.exitFullscreen if available', async () => {
      const originalExit = document.exitFullscreen;
      document.exitFullscreen = vi.fn().mockResolvedValue(undefined);

      await exitFullscreen();

      expect(document.exitFullscreen).toHaveBeenCalledTimes(1);

      document.exitFullscreen = originalExit;
    });

    it('should fall back to webkitExitFullscreen', async () => {
      const originalExit = document.exitFullscreen;
      (document as any).exitFullscreen = undefined;
      (document as any).webkitExitFullscreen = vi.fn().mockResolvedValue(undefined);

      await exitFullscreen();

      expect((document as any).webkitExitFullscreen).toHaveBeenCalledTimes(1);

      document.exitFullscreen = originalExit;
      delete (document as any).webkitExitFullscreen;
    });

    it('should reject if no exit fullscreen method is available', async () => {
      const originalExit = document.exitFullscreen;
      (document as any).exitFullscreen = undefined;

      await expect(exitFullscreen()).rejects.toThrow('Fullscreen API not supported');

      document.exitFullscreen = originalExit;
    });
  });
});
