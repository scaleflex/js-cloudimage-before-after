import type { CIBeforeAfterConfig, CIBeforeAfterInstance } from './types';
export declare class CIBeforeAfterCore implements CIBeforeAfterInstance {
    private config;
    private userConfig;
    private state;
    private elements;
    private events;
    private imageEvents;
    private sliderGestures;
    private zoomPan;
    private zoomGestures;
    private scrollHint;
    private fullscreenManager;
    private entranceAnimation;
    private keyboardHandler;
    private resizeObserver;
    private zoomControlsEl;
    private zoomControlsEvents;
    private lazyLoadObserver;
    private resizeDebounceTimer;
    private animTransitionTimer;
    private suppressCallbacks;
    constructor(target: HTMLElement | string, userConfig: CIBeforeAfterConfig);
    getElements(): {
        container: HTMLElement;
        viewport: HTMLElement;
        beforeImage: HTMLImageElement;
        afterImage: HTMLImageElement;
        handle: HTMLElement;
    };
    setPosition(percent: number): void;
    getPosition(): number;
    setZoom(level: number): void;
    getZoom(): number;
    resetZoom(): void;
    enterFullscreen(): void;
    exitFullscreen(): void;
    isFullscreen(): boolean;
    update(newConfig: Partial<CIBeforeAfterConfig>): void;
    destroy(): void;
    private buildDOM;
    private initModules;
    private initZoom;
    private applyZoomPositionClasses;
    private initEntranceAnimation;
    private loadImages;
    /**
     * Register load/error handlers for images. Cleans up previous handlers first.
     * When only one image changed, the unchanged image is treated as already loaded.
     */
    private registerImageLoadHandlers;
    private onImagesReady;
    private getClipZoomInfo;
    private syncClip;
    private updatePosition;
    private onDragStart;
    private onDragEnd;
    private resolveImageSrc;
    private rebuildHandle;
    private rebuildLabels;
    private rebuildZoom;
    private rebuildFullscreen;
    private initResizeObserver;
}
