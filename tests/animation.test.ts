import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { EntranceAnimation } from '../src/animation/entrance';

describe('EntranceAnimation', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    vi.useFakeTimers();
  });

  afterEach(() => {
    container.remove();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  function createAnimation(
    overrides: {
      duration?: number;
      delay?: number;
      easing?: string;
      animateOnce?: boolean;
      onAnimate?: () => void;
    } = {},
  ) {
    return new EntranceAnimation(
      container,
      overrides.duration ?? 800,
      overrides.delay ?? 0,
      overrides.easing ?? 'ease-out',
      overrides.animateOnce ?? true,
      overrides.onAnimate ?? vi.fn(),
    );
  }

  /**
   * Helper to retrieve the MockIntersectionObserver instance that was created
   * during EntranceAnimation construction. We spy on the global constructor
   * and capture the instance.
   */
  function createAnimationWithObserver(
    overrides: {
      duration?: number;
      delay?: number;
      easing?: string;
      animateOnce?: boolean;
      onAnimate?: () => void;
    } = {},
  ) {
    let capturedInstance: any = null;
    const OriginalIO = globalThis.IntersectionObserver;
    globalThis.IntersectionObserver = class extends (OriginalIO as any) {
      constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        super(callback, options);
        capturedInstance = this;
      }
    } as any;

    const animation = createAnimation(overrides);

    // Restore original
    globalThis.IntersectionObserver = OriginalIO;

    return { animation, observer: capturedInstance };
  }

  describe('Observer creation', () => {
    it('should create an IntersectionObserver and observe the container', () => {
      const observeSpy = vi.fn();
      const OriginalIO = globalThis.IntersectionObserver;

      globalThis.IntersectionObserver = class {
        observe = observeSpy;
        unobserve = vi.fn();
        disconnect = vi.fn();
        constructor(public callback: IntersectionObserverCallback, public options?: IntersectionObserverInit) {}
      } as any;

      createAnimation();

      expect(observeSpy).toHaveBeenCalledTimes(1);
      expect(observeSpy).toHaveBeenCalledWith(container);

      globalThis.IntersectionObserver = OriginalIO;
    });

    it('should use a threshold of 0.3', () => {
      let capturedOptions: IntersectionObserverInit | undefined;
      const OriginalIO = globalThis.IntersectionObserver;

      globalThis.IntersectionObserver = class {
        observe = vi.fn();
        unobserve = vi.fn();
        disconnect = vi.fn();
        constructor(public callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
          capturedOptions = options;
        }
      } as any;

      createAnimation();

      expect(capturedOptions).toBeDefined();
      expect(capturedOptions!.threshold).toBe(0.3);

      globalThis.IntersectionObserver = OriginalIO;
    });
  });

  describe('Animation triggers on intersection', () => {
    it('should call onAnimate when element intersects', () => {
      const onAnimate = vi.fn();
      const { observer } = createAnimationWithObserver({ onAnimate, delay: 0 });

      observer.triggerIntersection(true);

      // Advance past the delay (0ms)
      vi.advanceTimersByTime(0);

      expect(onAnimate).toHaveBeenCalledTimes(1);
    });

    it('should add entrance animation class on play', () => {
      const onAnimate = vi.fn();
      const { observer } = createAnimationWithObserver({ onAnimate, delay: 0 });

      observer.triggerIntersection(true);

      expect(container.classList.contains('ci-before-after-animate-entrance')).toBe(true);
    });

    it('should set CSS custom properties for duration and easing', () => {
      const { observer } = createAnimationWithObserver({
        duration: 500,
        easing: 'linear',
      });

      observer.triggerIntersection(true);

      expect(container.style.getPropertyValue('--ci-before-after-animate-duration')).toBe('500ms');
      expect(container.style.getPropertyValue('--ci-before-after-animate-easing')).toBe('linear');
    });

    it('should remove entrance class after duration completes', () => {
      const onAnimate = vi.fn();
      const { observer } = createAnimationWithObserver({ onAnimate, duration: 800, delay: 0 });

      observer.triggerIntersection(true);

      // Advance past the delay to trigger onAnimate
      vi.advanceTimersByTime(0);
      expect(container.classList.contains('ci-before-after-animate-entrance')).toBe(true);

      // Advance past the duration to remove the class
      vi.advanceTimersByTime(800);
      expect(container.classList.contains('ci-before-after-animate-entrance')).toBe(false);
    });

    it('should not trigger when not intersecting', () => {
      const onAnimate = vi.fn();
      const { observer } = createAnimationWithObserver({ onAnimate });

      observer.triggerIntersection(false);
      vi.advanceTimersByTime(10000);

      expect(onAnimate).not.toHaveBeenCalled();
    });
  });

  describe('animateOnce prevents re-trigger', () => {
    it('should not play again when animateOnce is true', () => {
      const onAnimate = vi.fn();
      const { animation, observer } = createAnimationWithObserver({
        onAnimate,
        animateOnce: true,
        delay: 0,
        duration: 100,
      });

      // First trigger
      observer.triggerIntersection(true);
      vi.advanceTimersByTime(0); // delay
      vi.advanceTimersByTime(100); // duration

      expect(onAnimate).toHaveBeenCalledTimes(1);
      expect(animation.getHasPlayed()).toBe(true);

      // Second trigger should be ignored
      observer.triggerIntersection(true);
      vi.advanceTimersByTime(0);
      vi.advanceTimersByTime(100);

      expect(onAnimate).toHaveBeenCalledTimes(1);
    });

    it('should play again when animateOnce is false', () => {
      const onAnimate = vi.fn();
      const { observer } = createAnimationWithObserver({
        onAnimate,
        animateOnce: false,
        delay: 0,
        duration: 100,
      });

      // First trigger
      observer.triggerIntersection(true);
      vi.advanceTimersByTime(0); // delay
      vi.advanceTimersByTime(100); // duration - clears isAnimating

      expect(onAnimate).toHaveBeenCalledTimes(1);

      // Second trigger should work
      observer.triggerIntersection(true);
      vi.advanceTimersByTime(0);
      vi.advanceTimersByTime(100);

      expect(onAnimate).toHaveBeenCalledTimes(2);
    });
  });

  describe('isAnimating guard prevents overlapping', () => {
    it('should not start a new animation while one is in progress', () => {
      const onAnimate = vi.fn();
      const { observer } = createAnimationWithObserver({
        onAnimate,
        animateOnce: false,
        delay: 0,
        duration: 500,
      });

      // First trigger
      observer.triggerIntersection(true);
      vi.advanceTimersByTime(0); // delay fires onAnimate

      expect(onAnimate).toHaveBeenCalledTimes(1);

      // Second trigger while still animating (within duration)
      observer.triggerIntersection(true);
      vi.advanceTimersByTime(0);

      // Should still be 1 because isAnimating is true
      expect(onAnimate).toHaveBeenCalledTimes(1);

      // After duration, isAnimating resets
      vi.advanceTimersByTime(500);

      // Now it should work again
      observer.triggerIntersection(true);
      vi.advanceTimersByTime(0);

      expect(onAnimate).toHaveBeenCalledTimes(2);
    });
  });

  describe('reduced-motion check', () => {
    let originalMatchMedia: typeof window.matchMedia;

    beforeEach(() => {
      originalMatchMedia = window.matchMedia;
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => true,
        }),
      });
    });

    afterEach(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: originalMatchMedia,
      });
    });

    it('should skip CSS animation when prefers-reduced-motion is active', () => {
      const onAnimate = vi.fn();
      const { observer } = createAnimationWithObserver({
        onAnimate,
        delay: 0,
        duration: 800,
      });

      observer.triggerIntersection(true);

      // With reduced motion, onAnimate should be called immediately
      expect(onAnimate).toHaveBeenCalledTimes(1);

      // The entrance class should NOT be added
      expect(container.classList.contains('ci-before-after-animate-entrance')).toBe(false);
    });

    it('should still mark hasPlayed when reduced-motion is active', () => {
      const { animation, observer } = createAnimationWithObserver({ animateOnce: true });

      observer.triggerIntersection(true);

      expect(animation.getHasPlayed()).toBe(true);
    });
  });

  describe('cleanup on destroy', () => {
    it('should disconnect the observer on destroy', () => {
      const disconnectSpy = vi.fn();
      const OriginalIO = globalThis.IntersectionObserver;

      globalThis.IntersectionObserver = class {
        observe = vi.fn();
        unobserve = vi.fn();
        disconnect = disconnectSpy;
        constructor(public callback: IntersectionObserverCallback) {}
      } as any;

      const animation = createAnimation();
      animation.destroy();

      expect(disconnectSpy).toHaveBeenCalledTimes(1);

      globalThis.IntersectionObserver = OriginalIO;
    });

    it('should handle destroy being called multiple times', () => {
      const animation = createAnimation();

      // Should not throw
      animation.destroy();
      animation.destroy();
    });
  });
});
