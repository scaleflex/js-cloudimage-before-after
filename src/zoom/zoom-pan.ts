import type { ResolvedConfig } from '../core/types';

export class ZoomPanController {
  private zoomLevel = 1;
  private panX = 0;
  private panY = 0;
  private containerWidth = 0;
  private containerHeight = 0;
  private transitioning = false;
  private transitionEndCleanup: (() => void) | null = null;
  private resizeObserver: ResizeObserver | null = null;

  private onTransformChange?: () => void;

  constructor(
    private viewport: HTMLElement,
    private container: HTMLElement,
    private config: ResolvedConfig,
    private onZoomChange?: (level: number) => void,
    onTransformChange?: () => void,
  ) {
    this.onTransformChange = onTransformChange;
    this.updateContainerSize();
    this.observeResize();
  }

  private observeResize(): void {
    if (typeof ResizeObserver === 'undefined') return;
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        this.containerWidth = width;
        this.containerHeight = height;
      }
    });
    this.resizeObserver.observe(this.container);
  }

  getZoom(): number {
    return this.zoomLevel;
  }

  getContainerSize(): { width: number; height: number } {
    return { width: this.containerWidth, height: this.containerHeight };
  }

  setZoom(level: number, centerX?: number, centerY?: number): void {
    const clamped = Math.max(this.config.zoomMin, Math.min(this.config.zoomMax, level));
    if (clamped === this.zoomLevel) return;

    const oldZoom = this.zoomLevel;
    this.zoomLevel = clamped;

    // Adjust pan to keep the center point fixed
    if (centerX !== undefined && centerY !== undefined) {
      this.panX = centerX - (centerX - this.panX) * (clamped / oldZoom);
      this.panY = centerY - (centerY - this.panY) * (clamped / oldZoom);
    }

    this.clampPan();
    this.applyTransform(true);
    this.onZoomChange?.(this.zoomLevel);
  }

  zoomIn(): void {
    this.setZoom(
      this.zoomLevel * 1.5,
      this.containerWidth / 2,
      this.containerHeight / 2,
    );
  }

  zoomOut(): void {
    this.setZoom(
      this.zoomLevel / 1.5,
      this.containerWidth / 2,
      this.containerHeight / 2,
    );
  }

  resetZoom(): void {
    this.zoomLevel = Math.max(1, this.config.zoomMin);
    this.panX = 0;
    this.panY = 0;
    this.applyTransform(true);
    this.onZoomChange?.(this.zoomLevel);
  }

  getPan(): { x: number; y: number } {
    return { x: this.panX, y: this.panY };
  }

  setPan(x: number, y: number): void {
    this.panX = x;
    this.panY = y;
    this.clampPan();
    this.applyTransform(false);
  }

  pan(dx: number, dy: number): void {
    if (this.zoomLevel <= 1) return;
    this.panX += dx;
    this.panY += dy;
    this.clampPan();
    this.applyTransform(false);
  }

  handleWheel(e: WheelEvent): void {
    if (!e.ctrlKey && !e.metaKey) return;

    e.preventDefault();

    const rect = this.container.getBoundingClientRect();
    const centerX = e.clientX - rect.left;
    const centerY = e.clientY - rect.top;

    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    this.setZoom(this.zoomLevel * delta, centerX, centerY);
  }

  toggleZoom(centerX: number, centerY: number): void {
    const resetLevel = Math.max(1, this.config.zoomMin);
    if (this.zoomLevel > resetLevel) {
      this.resetZoom();
    } else {
      this.setZoom(Math.max(2, resetLevel * 1.5), centerX, centerY);
    }
  }

  updateConfig(config: ResolvedConfig): void {
    this.config = config;
    // Re-clamp zoom level to new min/max bounds
    const clamped = Math.max(config.zoomMin, Math.min(config.zoomMax, this.zoomLevel));
    if (clamped !== this.zoomLevel) {
      this.zoomLevel = clamped;
      this.onZoomChange?.(this.zoomLevel);
    }
    this.clampPan();
    this.applyTransform(false);
  }

  private updateContainerSize(): void {
    const rect = this.container.getBoundingClientRect();
    this.containerWidth = rect.width;
    this.containerHeight = rect.height;
  }

  private clampPan(): void {
    if (this.zoomLevel <= 1) {
      this.panX = 0;
      this.panY = 0;
      return;
    }

    const maxPanX = this.containerWidth * (this.zoomLevel - 1);
    const maxPanY = this.containerHeight * (this.zoomLevel - 1);

    this.panX = Math.max(-maxPanX, Math.min(0, this.panX));
    this.panY = Math.max(-maxPanY, Math.min(0, this.panY));
  }

  private applyTransform(animate: boolean): void {
    // Clean up previous transitionend listener to prevent accumulation
    if (this.transitionEndCleanup) {
      this.transitionEndCleanup();
      this.transitionEndCleanup = null;
    }

    if (animate) {
      this.viewport.style.transition = 'transform 300ms ease';
      this.transitioning = true;
      const onEnd = (e: TransitionEvent) => {
        if (e.target !== this.viewport) return; // Ignore bubbled events from children
        this.viewport.style.transition = '';
        this.transitioning = false;
        this.transitionEndCleanup = null;
        this.viewport.removeEventListener('transitionend', onEnd);
      };
      this.viewport.addEventListener('transitionend', onEnd);
      this.transitionEndCleanup = () => {
        this.viewport.removeEventListener('transitionend', onEnd);
        this.viewport.style.transition = '';
        this.transitioning = false;
      };
    } else if (!this.transitioning) {
      this.viewport.style.transition = '';
    }

    this.viewport.style.transform =
      `scale(${this.zoomLevel}) translate(${this.panX / this.zoomLevel}px, ${this.panY / this.zoomLevel}px)`;

    this.onTransformChange?.();
  }

  destroy(): void {
    if (this.transitionEndCleanup) {
      this.transitionEndCleanup();
      this.transitionEndCleanup = null;
    }
    this.viewport.style.transform = '';
    this.viewport.style.transition = '';
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }
}
