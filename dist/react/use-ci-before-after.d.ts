import type { CIBeforeAfterConfig, CIBeforeAfterInstance } from '../core/types';
export declare function useCIBeforeAfter(config: CIBeforeAfterConfig): {
    containerRef: import("react").RefObject<HTMLDivElement>;
    instance: import("react").MutableRefObject<CIBeforeAfterInstance | null>;
};
