import type { Orientation } from '../core/types';
import { EventManager } from '../utils/events';

export interface KeyboardCallbacks {
  onPositionChange: (position: number) => void;
  getPosition: () => number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
}

export class KeyboardHandler {
  private events = new EventManager();

  constructor(
    private handle: HTMLElement,
    private orientation: Orientation,
    private step: number,
    private largeStep: number,
    private zoomEnabled: boolean,
    private callbacks: KeyboardCallbacks,
  ) {
    this.bind();
  }

  private bind(): void {
    this.events.on(this.handle, 'keydown', (e: KeyboardEvent) => {
      this.handleKeyDown(e);
    });
  }

  private handleKeyDown(e: KeyboardEvent): void {
    // Don't hijack browser shortcuts (Ctrl+Arrow = back/forward, Alt+Arrow = history)
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    const current = this.callbacks.getPosition();
    const increment = e.shiftKey ? this.largeStep : this.step;
    let newPosition: number | null = null;

    if (this.orientation === 'horizontal') {
      switch (e.key) {
        case 'ArrowLeft':
          newPosition = current - increment;
          break;
        case 'ArrowRight':
          newPosition = current + increment;
          break;
      }
    } else {
      switch (e.key) {
        case 'ArrowUp':
          newPosition = current - increment;
          break;
        case 'ArrowDown':
          newPosition = current + increment;
          break;
      }
    }

    switch (e.key) {
      case 'Home':
        newPosition = 0;
        break;
      case 'End':
        newPosition = 100;
        break;
    }

    if (newPosition !== null) {
      e.preventDefault();
      newPosition = Math.max(0, Math.min(100, newPosition));
      this.callbacks.onPositionChange(newPosition);
      return;
    }

    // Zoom shortcuts
    if (this.zoomEnabled) {
      switch (e.key) {
        case '+':
        case '=':
          e.preventDefault();
          this.callbacks.onZoomIn?.();
          break;
        case '-':
          e.preventDefault();
          this.callbacks.onZoomOut?.();
          break;
        case '0':
          e.preventDefault();
          this.callbacks.onZoomReset?.();
          break;
      }
    }
  }

  updateConfig(orientation: Orientation, step: number, largeStep: number, zoomEnabled: boolean): void {
    this.orientation = orientation;
    this.step = step;
    this.largeStep = largeStep;
    this.zoomEnabled = zoomEnabled;
  }

  destroy(): void {
    this.events.destroy();
  }
}
