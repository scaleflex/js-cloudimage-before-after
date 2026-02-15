import type { ZoomControlsPosition } from '../core/types';
import { EventManager } from '../utils/events';
export interface ZoomControlsCallbacks {
    onZoomIn: () => void;
    onZoomOut: () => void;
    onReset: () => void;
}
export interface ZoomControlsResult {
    element: HTMLElement;
    events: EventManager;
}
export declare function createZoomControls(position: ZoomControlsPosition, callbacks: ZoomControlsCallbacks): ZoomControlsResult;
