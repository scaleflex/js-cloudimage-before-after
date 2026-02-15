import type { ZoomPanController } from './zoom-pan';
export declare class ZoomGestures {
    private container;
    private handle;
    private zoomPan;
    private scrollHintCallback?;
    private events;
    private isPanning;
    private lastPanX;
    private lastPanY;
    private initialPinchDistance;
    private initialPinchZoom;
    private abortController;
    constructor(container: HTMLElement, handle: HTMLElement, zoomPan: ZoomPanController, scrollHintCallback?: (() => void) | undefined);
    private bind;
    private startPan;
    private startTouchPan;
    private startPinch;
    private cleanupWindowListeners;
    destroy(): void;
}
