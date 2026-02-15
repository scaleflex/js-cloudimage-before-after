import type { InteractionMode, Orientation } from '../core/types';
export interface SliderGesturesCallbacks {
    onPositionChange: (position: number) => void;
    onDragStart: () => void;
    onDragEnd: () => void;
}
export declare class SliderGestures {
    private container;
    private handle;
    private mode;
    private orientation;
    private callbacks;
    private events;
    private containerRect;
    private rafId;
    private pendingPosition;
    private abortController;
    constructor(container: HTMLElement, handle: HTMLElement, mode: InteractionMode, orientation: Orientation, callbacks: SliderGesturesCallbacks);
    private bind;
    private bindDrag;
    private startDrag;
    private startTouchDrag;
    private schedulePositionUpdate;
    private flushPositionUpdate;
    private cleanupWindowListeners;
    private bindHover;
    private bindClick;
    updateMode(mode: InteractionMode): void;
    updateOrientation(orientation: Orientation): void;
    destroy(): void;
}
