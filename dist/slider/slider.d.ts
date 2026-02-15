import type { Orientation } from '../core/types';
export interface ClipZoomInfo {
    level: number;
    panX: number;
    panY: number;
    containerWidth: number;
    containerHeight: number;
}
export declare function updateClipPath(clipEl: HTMLElement, position: number, orientation: Orientation, zoom?: ClipZoomInfo): void;
export declare function updateHandlePosition(handleEl: HTMLElement, position: number, orientation: Orientation): void;
export declare function clampPosition(value: number): number;
