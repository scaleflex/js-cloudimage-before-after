import { EventManager } from '../utils/events';
import type { ZoomPanController } from './zoom-pan';

const PAN_THRESHOLD = 3;

export class ZoomGestures {
  private events = new EventManager();
  private isPanning = false;
  private lastPanX = 0;
  private lastPanY = 0;
  private initialPinchDistance = 0;
  private initialPinchZoom = 1;
  private abortController: AbortController | null = null;

  constructor(
    private container: HTMLElement,
    private handle: HTMLElement,
    private zoomPan: ZoomPanController,
    private scrollHintCallback?: () => void,
  ) {
    this.bind();
  }

  private bind(): void {
    // Ctrl+Wheel zoom
    this.events.onNonPassive(this.container, 'wheel', (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        this.zoomPan.handleWheel(e);
      } else if (this.zoomPan.getZoom() > 1) {
        // Allow scroll pass-through when zoomed
      } else {
        this.scrollHintCallback?.();
      }
    });

    // Double-click to toggle zoom (not on handle)
    this.events.on(this.container, 'dblclick', (e: MouseEvent) => {
      if (this.handle.contains(e.target as Node)) return;
      const rect = this.container.getBoundingClientRect();
      this.zoomPan.toggleZoom(e.clientX - rect.left, e.clientY - rect.top);
    });

    // Pan via mouse drag (only when zoomed, not on handle)
    this.events.on(this.container, 'mousedown', (e: MouseEvent) => {
      if (this.handle.contains(e.target as Node)) return;
      if (this.zoomPan.getZoom() <= 1) return;
      e.preventDefault();
      this.startPan(e.clientX, e.clientY);
    });

    // Touch gestures (pinch + pan)
    this.events.on(this.container, 'touchstart', (e: TouchEvent) => {
      if (this.handle.contains(e.target as Node)) return;

      if (e.touches.length === 2) {
        e.preventDefault();
        this.startPinch(e);
      } else if (e.touches.length === 1 && this.zoomPan.getZoom() > 1) {
        e.preventDefault();
        this.startTouchPan(e);
      }
    }, { passive: false });

    // Safari GestureEvent
    if (typeof window !== 'undefined' && 'GestureEvent' in window) {
      let gestureCenterX = 0;
      let gestureCenterY = 0;

      this.events.onNonPassive(this.container, 'gesturestart' as keyof HTMLElementEventMap, (e: Event) => {
        e.preventDefault();
        this.initialPinchZoom = this.zoomPan.getZoom();
        const ge = e as GestureEvent & { clientX: number; clientY: number };
        const rect = this.container.getBoundingClientRect();
        gestureCenterX = ge.clientX - rect.left;
        gestureCenterY = ge.clientY - rect.top;
      });

      this.events.onNonPassive(this.container, 'gesturechange' as keyof HTMLElementEventMap, (e: Event) => {
        e.preventDefault();
        const ge = e as GestureEvent & { clientX: number; clientY: number };
        const rect = this.container.getBoundingClientRect();
        this.zoomPan.setZoom(
          this.initialPinchZoom * ge.scale,
          ge.clientX - rect.left,
          ge.clientY - rect.top,
        );
      });
    }
  }

  private startPan(clientX: number, clientY: number): void {
    this.cleanupWindowListeners();
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    this.isPanning = false;
    this.lastPanX = clientX;
    this.lastPanY = clientY;
    const startX = clientX;
    const startY = clientY;

    const onMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - this.lastPanX;
      const dy = e.clientY - this.lastPanY;

      // Only start panning after exceeding threshold (BUG-09)
      if (!this.isPanning) {
        const totalDx = e.clientX - startX;
        const totalDy = e.clientY - startY;
        if (Math.hypot(totalDx, totalDy) < PAN_THRESHOLD) return;
        this.isPanning = true;
        this.container.style.cursor = 'grabbing';
      }

      this.lastPanX = e.clientX;
      this.lastPanY = e.clientY;
      this.zoomPan.pan(dx, dy);
    };

    const onMouseUp = () => {
      this.isPanning = false;
      this.container.style.cursor = '';
      this.cleanupWindowListeners();
    };

    window.addEventListener('mousemove', onMouseMove, { signal });
    window.addEventListener('mouseup', onMouseUp, { signal });
  }

  private startTouchPan(e: TouchEvent): void {
    this.cleanupWindowListeners();
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    const touch = e.touches[0];
    this.lastPanX = touch.clientX;
    this.lastPanY = touch.clientY;

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      e.preventDefault();
      const touch = e.touches[0];
      const dx = touch.clientX - this.lastPanX;
      const dy = touch.clientY - this.lastPanY;
      this.lastPanX = touch.clientX;
      this.lastPanY = touch.clientY;
      this.zoomPan.pan(dx, dy);
    };

    const onTouchEnd = () => {
      this.cleanupWindowListeners();
    };

    window.addEventListener('touchmove', onTouchMove, { passive: false, signal });
    window.addEventListener('touchend', onTouchEnd, { signal });
    window.addEventListener('touchcancel', onTouchEnd, { signal });
  }

  private startPinch(e: TouchEvent): void {
    if (e.touches.length < 2) return;

    this.cleanupWindowListeners();
    this.abortController = new AbortController();
    const signal = this.abortController.signal;
    const [t1, t2] = [e.touches[0], e.touches[1]];
    this.initialPinchDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
    if (this.initialPinchDistance === 0) this.initialPinchDistance = 1;
    this.initialPinchZoom = this.zoomPan.getZoom();

    const rect = this.container.getBoundingClientRect();
    const centerX = (t1.clientX + t2.clientX) / 2 - rect.left;
    const centerY = (t1.clientY + t2.clientY) / 2 - rect.top;

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2) return;
      e.preventDefault();
      const [t1, t2] = [e.touches[0], e.touches[1]];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const scale = dist / this.initialPinchDistance;
      this.zoomPan.setZoom(this.initialPinchZoom * scale, centerX, centerY);
    };

    const onTouchEnd = () => {
      this.cleanupWindowListeners();
    };

    window.addEventListener('touchmove', onTouchMove, { passive: false, signal });
    window.addEventListener('touchend', onTouchEnd, { signal });
    window.addEventListener('touchcancel', onTouchEnd, { signal });
  }

  private cleanupWindowListeners(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  destroy(): void {
    this.cleanupWindowListeners();
    this.events.destroy();
  }
}

interface GestureEvent extends Event {
  scale: number;
}
