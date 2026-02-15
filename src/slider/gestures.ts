import type { InteractionMode, Orientation } from '../core/types';
import { EventManager, getPositionPercent } from '../utils/events';

export interface SliderGesturesCallbacks {
  onPositionChange: (position: number) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export class SliderGestures {
  private events = new EventManager();
  private containerRect: DOMRect | null = null;
  private rafId: number | null = null;
  private pendingPosition: number | null = null;
  private abortController: AbortController | null = null;

  constructor(
    private container: HTMLElement,
    private handle: HTMLElement,
    private mode: InteractionMode,
    private orientation: Orientation,
    private callbacks: SliderGesturesCallbacks,
  ) {
    this.bind();
  }

  private bind(): void {
    switch (this.mode) {
      case 'drag':
        this.bindDrag();
        break;
      case 'hover':
        this.bindHover();
        break;
      case 'click':
        this.bindClick();
        break;
    }
  }

  private bindDrag(): void {
    this.events.on(this.handle, 'mousedown', (e: MouseEvent) => {
      e.preventDefault();
      this.startDrag();
    });

    this.events.on(this.handle, 'touchstart', (e: TouchEvent) => {
      e.preventDefault();
      this.handle.focus();
      this.startTouchDrag();
    }, { passive: false });
  }

  private startDrag(): void {
    this.cleanupWindowListeners();
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    this.containerRect = this.container.getBoundingClientRect();
    this.callbacks.onDragStart();

    const onMouseMove = (e: MouseEvent) => {
      if (!this.containerRect) return;
      const position = getPositionPercent(e, this.containerRect, this.orientation);
      this.schedulePositionUpdate(position);
    };

    const onMouseUp = () => {
      this.flushPositionUpdate();
      this.callbacks.onDragEnd();
      this.containerRect = null;
      this.cleanupWindowListeners();
    };

    window.addEventListener('mousemove', onMouseMove, { signal });
    window.addEventListener('mouseup', onMouseUp, { signal });
  }

  private startTouchDrag(): void {
    this.cleanupWindowListeners();
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    this.containerRect = this.container.getBoundingClientRect();
    this.callbacks.onDragStart();

    const onTouchMove = (e: TouchEvent) => {
      if (!this.containerRect) return;
      if (e.touches.length !== 1) return;
      e.preventDefault();
      const position = getPositionPercent(e, this.containerRect, this.orientation);
      this.schedulePositionUpdate(position);
    };

    const onTouchEnd = () => {
      this.flushPositionUpdate();
      this.callbacks.onDragEnd();
      this.containerRect = null;
      this.cleanupWindowListeners();
    };

    window.addEventListener('touchmove', onTouchMove, { passive: false, signal });
    window.addEventListener('touchend', onTouchEnd, { signal });
    window.addEventListener('touchcancel', onTouchEnd, { signal });
  }

  private schedulePositionUpdate(position: number): void {
    this.pendingPosition = position;
    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(() => {
        this.rafId = null;
        if (this.pendingPosition !== null) {
          this.callbacks.onPositionChange(this.pendingPosition);
          this.pendingPosition = null;
        }
      });
    }
  }

  private flushPositionUpdate(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.pendingPosition !== null) {
      this.callbacks.onPositionChange(this.pendingPosition);
      this.pendingPosition = null;
    }
  }

  private cleanupWindowListeners(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  private bindHover(): void {
    this.events.on(this.container, 'mousemove', (e: MouseEvent) => {
      const rect = this.container.getBoundingClientRect();
      const position = getPositionPercent(e, rect, this.orientation);
      this.schedulePositionUpdate(position);
    });
  }

  private bindClick(): void {
    this.events.on(this.container, 'click', (e: MouseEvent) => {
      if (this.handle.contains(e.target as Node)) return;
      const rect = this.container.getBoundingClientRect();
      const position = getPositionPercent(e, rect, this.orientation);
      this.callbacks.onPositionChange(position);
    });
  }

  updateMode(mode: InteractionMode): void {
    this.events.destroy();
    this.cleanupWindowListeners();
    this.flushPositionUpdate();
    this.mode = mode;
    this.bind();
  }

  updateOrientation(orientation: Orientation): void {
    this.orientation = orientation;
  }

  destroy(): void {
    this.cleanupWindowListeners();
    // Discard pending position instead of flushing — avoid firing onSlide during teardown
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.pendingPosition = null;
    this.events.destroy();
    this.containerRect = null;
  }
}
