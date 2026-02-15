import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CIBeforeAfterCore } from '../src/core/ci-before-after';
import type { CIBeforeAfterConfig } from '../src/core/types';

describe('Integration tests', () => {
  let container: HTMLElement;

  const defaultConfig: CIBeforeAfterConfig = {
    beforeSrc: 'https://example.com/before.jpg',
    afterSrc: 'https://example.com/after.jpg',
    lazyLoad: false,
    fullscreenButton: false,
    labels: false,
  };

  beforeEach(() => {
    vi.useFakeTimers();
    container = document.createElement('div');
    container.id = 'test-widget';
    document.body.appendChild(container);

    // Give the container dimensions for position calculations
    Object.defineProperty(container, 'getBoundingClientRect', {
      value: () => ({
        left: 0,
        top: 0,
        width: 800,
        height: 600,
        right: 800,
        bottom: 600,
        x: 0,
        y: 0,
        toJSON: () => {},
      }),
      configurable: true,
    });
  });

  afterEach(() => {
    container.remove();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  function createInstance(overrides: Partial<CIBeforeAfterConfig> = {}) {
    const config = { ...defaultConfig, ...overrides };
    const instance = new CIBeforeAfterCore(container, config);

    // Flush image load events
    vi.advanceTimersByTime(10);

    return instance;
  }

  describe('update() preserves previous config (BUG-01 fix)', () => {
    it('should preserve theme when updating beforeSrc', () => {
      const instance = createInstance({ theme: 'dark' });

      expect(container.classList.contains('ci-before-after-theme-dark')).toBe(true);

      instance.update({ beforeSrc: 'https://example.com/new-before.jpg' });

      // Theme should still be dark
      expect(container.classList.contains('ci-before-after-theme-dark')).toBe(true);

      instance.destroy();
    });

    it('should preserve orientation when updating afterSrc', () => {
      const instance = createInstance({ orientation: 'vertical' });

      expect(container.classList.contains('ci-before-after-container--vertical')).toBe(true);

      instance.update({ afterSrc: 'https://example.com/new-after.jpg' });

      // Orientation should still be vertical
      expect(container.classList.contains('ci-before-after-container--vertical')).toBe(true);

      instance.destroy();
    });

    it('should preserve initialPosition when updating mode', () => {
      const onSlide = vi.fn();
      const instance = createInstance({ initialPosition: 75, onSlide });

      const positionAfterInit = instance.getPosition();
      expect(positionAfterInit).toBe(75);

      instance.update({ mode: 'hover' });

      // Position should still be 75
      expect(instance.getPosition()).toBe(75);

      instance.destroy();
    });

    it('should preserve callbacks when updating visual properties', () => {
      const onSlide = vi.fn();
      const instance = createInstance({ onSlide });

      instance.update({ theme: 'dark' });

      // Setting position should still trigger the preserved callback
      instance.setPosition(30);
      expect(onSlide).toHaveBeenCalledWith(30);

      instance.destroy();
    });
  });

  describe('update() only changes specified fields', () => {
    it('should update only the theme without affecting other config', () => {
      const instance = createInstance({
        orientation: 'horizontal',
        theme: 'light',
        handleStyle: 'arrows',
      });

      expect(container.classList.contains('ci-before-after-theme-dark')).toBe(false);

      instance.update({ theme: 'dark' });

      expect(container.classList.contains('ci-before-after-theme-dark')).toBe(true);
      expect(container.classList.contains('ci-before-after-container--horizontal')).toBe(true);

      instance.destroy();
    });

    it('should update image sources independently', () => {
      const instance = createInstance();
      const elements = instance.getElements();

      const originalAfterSrc = elements.afterImage.src;

      instance.update({ beforeSrc: 'https://example.com/updated-before.jpg' });

      expect(elements.beforeImage.src).toBe('https://example.com/updated-before.jpg');
      expect(elements.afterImage.src).toBe(originalAfterSrc);

      instance.destroy();
    });

    it('should update orientation classes correctly', () => {
      const instance = createInstance({ orientation: 'horizontal' });

      expect(container.classList.contains('ci-before-after-container--horizontal')).toBe(true);
      expect(container.classList.contains('ci-before-after-container--vertical')).toBe(false);

      instance.update({ orientation: 'vertical' });

      expect(container.classList.contains('ci-before-after-container--horizontal')).toBe(false);
      expect(container.classList.contains('ci-before-after-container--vertical')).toBe(true);

      instance.destroy();
    });
  });

  describe('Keyboard navigation moves position', () => {
    it('should move position right with ArrowRight key', () => {
      const instance = createInstance({ initialPosition: 50 });
      const elements = instance.getElements();

      elements.handle.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
      );

      expect(instance.getPosition()).toBe(51); // default keyboardStep is 1
      instance.destroy();
    });

    it('should move position left with ArrowLeft key', () => {
      const instance = createInstance({ initialPosition: 50 });
      const elements = instance.getElements();

      elements.handle.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }),
      );

      expect(instance.getPosition()).toBe(49);
      instance.destroy();
    });

    it('should move by large step when Shift is held', () => {
      const instance = createInstance({ initialPosition: 50, keyboardLargeStep: 10 });
      const elements = instance.getElements();

      elements.handle.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight', shiftKey: true, bubbles: true }),
      );

      expect(instance.getPosition()).toBe(60);
      instance.destroy();
    });

    it('should go to 0% on Home key', () => {
      const instance = createInstance({ initialPosition: 50 });
      const elements = instance.getElements();

      elements.handle.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Home', bubbles: true }),
      );

      expect(instance.getPosition()).toBe(0);
      instance.destroy();
    });

    it('should go to 100% on End key', () => {
      const instance = createInstance({ initialPosition: 50 });
      const elements = instance.getElements();

      elements.handle.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'End', bubbles: true }),
      );

      expect(instance.getPosition()).toBe(100);
      instance.destroy();
    });

    it('should clamp position at 0% lower bound', () => {
      const instance = createInstance({ initialPosition: 0 });
      const elements = instance.getElements();

      elements.handle.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }),
      );

      expect(instance.getPosition()).toBe(0);
      instance.destroy();
    });

    it('should clamp position at 100% upper bound', () => {
      const instance = createInstance({ initialPosition: 100 });
      const elements = instance.getElements();

      elements.handle.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
      );

      expect(instance.getPosition()).toBe(100);
      instance.destroy();
    });

    it('should use ArrowUp/ArrowDown for vertical orientation', () => {
      const instance = createInstance({ initialPosition: 50, orientation: 'vertical' });
      const elements = instance.getElements();

      elements.handle.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
      );

      expect(instance.getPosition()).toBe(51);

      elements.handle.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }),
      );

      expect(instance.getPosition()).toBe(50);

      instance.destroy();
    });
  });

  describe('Image error handling removes loading class', () => {
    it('should remove loading class when before image fails to load', () => {
      // Create instance - container will have loading class
      const instance = new CIBeforeAfterCore(container, {
        ...defaultConfig,
        beforeSrc: 'https://example.com/broken.jpg',
      });

      // The loading class is added during construction
      expect(container.classList.contains('ci-before-after-loading')).toBe(true);

      // Simulate error on before image and load on after image (both must report)
      const elements = instance.getElements();
      elements.beforeImage.dispatchEvent(new Event('error'));
      elements.afterImage.dispatchEvent(new Event('load'));

      expect(container.classList.contains('ci-before-after-loading')).toBe(false);

      instance.destroy();
    });

    it('should remove loading class when after image fails to load', () => {
      const instance = new CIBeforeAfterCore(container, {
        ...defaultConfig,
        afterSrc: 'https://example.com/broken.jpg',
      });

      expect(container.classList.contains('ci-before-after-loading')).toBe(true);

      // Simulate load on before image and error on after image (both must report)
      const elements = instance.getElements();
      elements.beforeImage.dispatchEvent(new Event('load'));
      elements.afterImage.dispatchEvent(new Event('error'));

      expect(container.classList.contains('ci-before-after-loading')).toBe(false);

      instance.destroy();
    });

    it('should warn to console when an image fails to load', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const instance = new CIBeforeAfterCore(container, {
        ...defaultConfig,
        beforeSrc: 'https://example.com/broken.jpg',
      });

      const elements = instance.getElements();
      elements.beforeImage.dispatchEvent(new Event('error'));

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to load image'));

      instance.destroy();
    });
  });

  describe('Destroy during drag does not leak listeners (BUG-02 fix)', () => {
    it('should clean up all event listeners on destroy', () => {
      const instance = createInstance();

      // Trigger a drag start by dispatching mousedown on the handle
      const elements = instance.getElements();
      elements.handle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

      // Now destroy while "dragging"
      instance.destroy();

      // Verify container is cleaned up
      expect(container.innerHTML).toBe('');
    });

    it('should not throw when dispatching mouse events after destroy', () => {
      const instance = createInstance();
      const elements = instance.getElements();

      // Start a drag
      elements.handle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

      instance.destroy();

      // These should not throw even though the instance is destroyed
      expect(() => {
        window.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
        window.dispatchEvent(new MouseEvent('mouseup'));
      }).not.toThrow();
    });

    it('should remove all ci-before-after classes from container', () => {
      container.classList.add('custom-class');
      const instance = createInstance();

      // Container should have ci-before-after classes
      const hasBeforeAfterClass = Array.from(container.classList).some((c) =>
        c.startsWith('ci-before-after'),
      );
      expect(hasBeforeAfterClass).toBe(true);

      instance.destroy();

      // ci-before-after classes should be removed, but custom class preserved
      const hasBeforeAfterClassAfter = Array.from(container.classList).some((c) =>
        c.startsWith('ci-before-after'),
      );
      expect(hasBeforeAfterClassAfter).toBe(false);
      expect(container.classList.contains('custom-class')).toBe(true);
    });

    it('should remove ARIA attributes from container on destroy', () => {
      const instance = createInstance();

      // Container should have ARIA attributes from construction
      expect(container.hasAttribute('role')).toBe(true);

      instance.destroy();

      expect(container.hasAttribute('role')).toBe(false);
      expect(container.hasAttribute('aria-label')).toBe(false);
    });
  });
});
