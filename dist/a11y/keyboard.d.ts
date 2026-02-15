import type { Orientation } from '../core/types';
export interface KeyboardCallbacks {
    onPositionChange: (position: number) => void;
    getPosition: () => number;
    onZoomIn?: () => void;
    onZoomOut?: () => void;
    onZoomReset?: () => void;
}
export declare class KeyboardHandler {
    private handle;
    private orientation;
    private step;
    private largeStep;
    private zoomEnabled;
    private callbacks;
    private events;
    constructor(handle: HTMLElement, orientation: Orientation, step: number, largeStep: number, zoomEnabled: boolean, callbacks: KeyboardCallbacks);
    private bind;
    private handleKeyDown;
    updateConfig(orientation: Orientation, step: number, largeStep: number, zoomEnabled: boolean): void;
    destroy(): void;
}
