import type { LabelPosition, Orientation } from '../core/types';
export declare function createLabels(beforeText: string, afterText: string, position: LabelPosition, orientation: Orientation): {
    before: HTMLElement;
    after: HTMLElement;
};
export declare function updateLabelVisibility(beforeLabel: HTMLElement | null, afterLabel: HTMLElement | null, position: number, orientation: Orientation): void;
