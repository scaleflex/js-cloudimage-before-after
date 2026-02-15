import type { ResolvedConfig } from '../core/types';
export declare class ZoomPanController {
    private viewport;
    private container;
    private config;
    private onZoomChange?;
    private zoomLevel;
    private panX;
    private panY;
    private containerWidth;
    private containerHeight;
    private transitioning;
    private transitionEndCleanup;
    private resizeObserver;
    private onTransformChange?;
    constructor(viewport: HTMLElement, container: HTMLElement, config: ResolvedConfig, onZoomChange?: ((level: number) => void) | undefined, onTransformChange?: () => void);
    private observeResize;
    getZoom(): number;
    getContainerSize(): {
        width: number;
        height: number;
    };
    setZoom(level: number, centerX?: number, centerY?: number): void;
    zoomIn(): void;
    zoomOut(): void;
    resetZoom(): void;
    getPan(): {
        x: number;
        y: number;
    };
    setPan(x: number, y: number): void;
    pan(dx: number, dy: number): void;
    handleWheel(e: WheelEvent): void;
    toggleZoom(centerX: number, centerY: number): void;
    updateConfig(config: ResolvedConfig): void;
    private updateContainerSize;
    private clampPan;
    private applyTransform;
    destroy(): void;
}
