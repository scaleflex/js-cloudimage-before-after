import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { EventManager, getPointerPosition, getPositionPercent } from '../src/utils/events';

describe('EventManager', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('on / add listeners', () => {
    it('should add an event listener that fires on dispatch', () => {
      const manager = new EventManager();
      const handler = vi.fn();

      manager.on(container, 'click', handler);
      container.dispatchEvent(new MouseEvent('click'));

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should add multiple listeners for different events', () => {
      const manager = new EventManager();
      const clickHandler = vi.fn();
      const mousedownHandler = vi.fn();

      manager.on(container, 'click', clickHandler);
      manager.on(container, 'mousedown', mousedownHandler);

      container.dispatchEvent(new MouseEvent('click'));
      container.dispatchEvent(new MouseEvent('mousedown'));

      expect(clickHandler).toHaveBeenCalledTimes(1);
      expect(mousedownHandler).toHaveBeenCalledTimes(1);
    });

    it('should add multiple listeners for the same event', () => {
      const manager = new EventManager();
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      manager.on(container, 'click', handler1);
      manager.on(container, 'click', handler2);

      container.dispatchEvent(new MouseEvent('click'));

      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
    });

    it('should support event listener options', () => {
      const manager = new EventManager();
      const handler = vi.fn();

      manager.on(container, 'click', handler, { once: true });

      container.dispatchEvent(new MouseEvent('click'));
      container.dispatchEvent(new MouseEvent('click'));

      // With { once: true }, the handler should only fire once even without explicit removal
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should work with window as target', () => {
      const manager = new EventManager();
      const handler = vi.fn();

      manager.on(window, 'resize', handler);
      window.dispatchEvent(new Event('resize'));

      expect(handler).toHaveBeenCalledTimes(1);

      manager.destroy();
    });

    it('should work with document as target', () => {
      const manager = new EventManager();
      const handler = vi.fn();

      manager.on(document, 'keydown', handler);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));

      expect(handler).toHaveBeenCalledTimes(1);

      manager.destroy();
    });
  });

  describe('destroy / remove listeners', () => {
    it('should remove all registered listeners on destroy', () => {
      const manager = new EventManager();
      const clickHandler = vi.fn();
      const mousedownHandler = vi.fn();

      manager.on(container, 'click', clickHandler);
      manager.on(container, 'mousedown', mousedownHandler);

      manager.destroy();

      container.dispatchEvent(new MouseEvent('click'));
      container.dispatchEvent(new MouseEvent('mousedown'));

      expect(clickHandler).not.toHaveBeenCalled();
      expect(mousedownHandler).not.toHaveBeenCalled();
    });

    it('should handle destroy being called when no listeners were added', () => {
      const manager = new EventManager();

      // Should not throw
      manager.destroy();
    });

    it('should handle destroy being called multiple times', () => {
      const manager = new EventManager();
      const handler = vi.fn();

      manager.on(container, 'click', handler);

      manager.destroy();
      manager.destroy();

      container.dispatchEvent(new MouseEvent('click'));
      expect(handler).not.toHaveBeenCalled();
    });

    it('should clear the internal cleanups list after destroy', () => {
      const manager = new EventManager();
      const handler = vi.fn();

      manager.on(container, 'click', handler);
      manager.destroy();

      // Re-add a listener after destroy
      const handler2 = vi.fn();
      manager.on(container, 'click', handler2);

      container.dispatchEvent(new MouseEvent('click'));

      // Only handler2 should fire since handler was removed
      expect(handler).not.toHaveBeenCalled();
      expect(handler2).toHaveBeenCalledTimes(1);

      manager.destroy();
    });
  });

  describe('onPassive', () => {
    it('should add a passive event listener', () => {
      const manager = new EventManager();
      const handler = vi.fn();
      const addSpy = vi.spyOn(container, 'addEventListener');

      manager.onPassive(container, 'touchstart', handler);

      expect(addSpy).toHaveBeenCalledWith('touchstart', expect.any(Function), { passive: true });

      container.dispatchEvent(new Event('touchstart'));
      expect(handler).toHaveBeenCalledTimes(1);

      manager.destroy();
    });
  });

  describe('onNonPassive', () => {
    it('should add a non-passive event listener', () => {
      const manager = new EventManager();
      const handler = vi.fn();
      const addSpy = vi.spyOn(container, 'addEventListener');

      manager.onNonPassive(container, 'touchmove', handler);

      expect(addSpy).toHaveBeenCalledWith('touchmove', expect.any(Function), { passive: false });

      container.dispatchEvent(new Event('touchmove'));
      expect(handler).toHaveBeenCalledTimes(1);

      manager.destroy();
    });
  });
});

describe('getPointerPosition', () => {
  const rect: DOMRect = {
    left: 100,
    top: 200,
    width: 400,
    height: 300,
    right: 500,
    bottom: 500,
    x: 100,
    y: 200,
    toJSON: () => {},
  };

  describe('from mouse events', () => {
    it('should calculate position relative to rect from mouse event', () => {
      const event = new MouseEvent('mousemove', {
        clientX: 250,
        clientY: 350,
      });

      const pos = getPointerPosition(event, rect);

      expect(pos.x).toBe(150); // 250 - 100
      expect(pos.y).toBe(150); // 350 - 200
    });

    it('should handle position at the origin of the rect', () => {
      const event = new MouseEvent('mousemove', {
        clientX: 100,
        clientY: 200,
      });

      const pos = getPointerPosition(event, rect);

      expect(pos.x).toBe(0);
      expect(pos.y).toBe(0);
    });

    it('should handle position beyond the rect bounds', () => {
      const event = new MouseEvent('mousemove', {
        clientX: 600,
        clientY: 600,
      });

      const pos = getPointerPosition(event, rect);

      expect(pos.x).toBe(500); // 600 - 100
      expect(pos.y).toBe(400); // 600 - 200
    });
  });

  describe('from touch events', () => {
    // jsdom doesn't provide the Touch constructor, so we create
    // a minimal object that satisfies the TouchEvent shape.
    function createTouchEvent(
      type: string,
      touches: Array<{ clientX: number; clientY: number }>,
      changedTouches: Array<{ clientX: number; clientY: number }> = [],
    ): TouchEvent {
      return {
        type,
        touches,
        changedTouches,
      } as unknown as TouchEvent;
    }

    it('should calculate position from touch event', () => {
      const event = createTouchEvent('touchmove', [{ clientX: 300, clientY: 350 }]);

      const pos = getPointerPosition(event, rect);

      expect(pos.x).toBe(200); // 300 - 100
      expect(pos.y).toBe(150); // 350 - 200
    });

    it('should use changedTouches when touches is empty', () => {
      const event = createTouchEvent('touchend', [], [{ clientX: 200, clientY: 250 }]);

      const pos = getPointerPosition(event, rect);

      expect(pos.x).toBe(100); // 200 - 100
      expect(pos.y).toBe(50);  // 250 - 200
    });
  });
});

describe('getPositionPercent', () => {
  const rect: DOMRect = {
    left: 0,
    top: 0,
    width: 400,
    height: 300,
    right: 400,
    bottom: 300,
    x: 0,
    y: 0,
    toJSON: () => {},
  };

  describe('horizontal orientation', () => {
    it('should return 50% for the center', () => {
      const event = new MouseEvent('mousemove', { clientX: 200, clientY: 150 });
      const percent = getPositionPercent(event, rect, 'horizontal');
      expect(percent).toBe(50);
    });

    it('should return 0% at the left edge', () => {
      const event = new MouseEvent('mousemove', { clientX: 0, clientY: 150 });
      const percent = getPositionPercent(event, rect, 'horizontal');
      expect(percent).toBe(0);
    });

    it('should return 100% at the right edge', () => {
      const event = new MouseEvent('mousemove', { clientX: 400, clientY: 150 });
      const percent = getPositionPercent(event, rect, 'horizontal');
      expect(percent).toBe(100);
    });

    it('should clamp to 0% when pointer is before the element', () => {
      const event = new MouseEvent('mousemove', { clientX: -50, clientY: 150 });
      const percent = getPositionPercent(event, rect, 'horizontal');
      expect(percent).toBe(0);
    });

    it('should clamp to 100% when pointer is past the element', () => {
      const event = new MouseEvent('mousemove', { clientX: 500, clientY: 150 });
      const percent = getPositionPercent(event, rect, 'horizontal');
      expect(percent).toBe(100);
    });

    it('should calculate 25% correctly', () => {
      const event = new MouseEvent('mousemove', { clientX: 100, clientY: 150 });
      const percent = getPositionPercent(event, rect, 'horizontal');
      expect(percent).toBe(25);
    });
  });

  describe('vertical orientation', () => {
    it('should return 50% for the vertical center', () => {
      const event = new MouseEvent('mousemove', { clientX: 200, clientY: 150 });
      const percent = getPositionPercent(event, rect, 'vertical');
      expect(percent).toBe(50);
    });

    it('should return 0% at the top edge', () => {
      const event = new MouseEvent('mousemove', { clientX: 200, clientY: 0 });
      const percent = getPositionPercent(event, rect, 'vertical');
      expect(percent).toBe(0);
    });

    it('should return 100% at the bottom edge', () => {
      const event = new MouseEvent('mousemove', { clientX: 200, clientY: 300 });
      const percent = getPositionPercent(event, rect, 'vertical');
      expect(percent).toBe(100);
    });

    it('should clamp to 0% when pointer is above the element', () => {
      const event = new MouseEvent('mousemove', { clientX: 200, clientY: -20 });
      const percent = getPositionPercent(event, rect, 'vertical');
      expect(percent).toBe(0);
    });

    it('should clamp to 100% when pointer is below the element', () => {
      const event = new MouseEvent('mousemove', { clientX: 200, clientY: 400 });
      const percent = getPositionPercent(event, rect, 'vertical');
      expect(percent).toBe(100);
    });
  });
});
