export type InteractionMode = 'drag' | 'hover' | 'click';
export type Orientation = 'horizontal' | 'vertical';
export type HandleStyle = 'arrows' | 'circle' | 'line';
export type Theme = 'light' | 'dark';
export type LabelPosition = 'top' | 'bottom';
export type ZoomControlsPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
export interface AnimateConfig {
    duration?: number;
    delay?: number;
    easing?: string;
}
export interface CloudimageConfig {
    token: string;
    apiVersion?: string;
    domain?: string;
    limitFactor?: number;
    params?: string;
    devicePixelRatioList?: number[];
}
export interface CIBeforeAfterConfig {
    beforeSrc: string;
    afterSrc: string;
    beforeAlt?: string;
    afterAlt?: string;
    mode?: InteractionMode;
    orientation?: Orientation;
    initialPosition?: number;
    zoom?: boolean;
    zoomMax?: number;
    zoomMin?: number;
    theme?: Theme;
    handleStyle?: HandleStyle;
    labels?: boolean | {
        before?: string;
        after?: string;
    };
    labelPosition?: LabelPosition;
    animate?: boolean | AnimateConfig;
    animateOnce?: boolean;
    fullscreenButton?: boolean;
    lazyLoad?: boolean;
    zoomControls?: boolean;
    zoomControlsPosition?: ZoomControlsPosition;
    scrollHint?: boolean;
    keyboardStep?: number;
    keyboardLargeStep?: number;
    onSlide?: (position: number) => void;
    onZoom?: (level: number) => void;
    onFullscreenChange?: (isFullscreen: boolean) => void;
    onReady?: () => void;
    cloudimage?: CloudimageConfig;
}
export interface ResolvedConfig {
    beforeSrc: string;
    afterSrc: string;
    beforeAlt: string;
    afterAlt: string;
    mode: InteractionMode;
    orientation: Orientation;
    initialPosition: number;
    zoom: boolean;
    zoomMax: number;
    zoomMin: number;
    theme: Theme;
    handleStyle: HandleStyle;
    labelsEnabled: boolean;
    labelBefore: string;
    labelAfter: string;
    labelPosition: LabelPosition;
    animateEnabled: boolean;
    animateDuration: number;
    animateDelay: number;
    animateEasing: string;
    animateOnce: boolean;
    fullscreenButton: boolean;
    lazyLoad: boolean;
    zoomControls: boolean;
    zoomControlsPosition: ZoomControlsPosition;
    scrollHint: boolean;
    keyboardStep: number;
    keyboardLargeStep: number;
    onSlide?: (position: number) => void;
    onZoom?: (level: number) => void;
    onFullscreenChange?: (isFullscreen: boolean) => void;
    onReady?: () => void;
    cloudimage?: CloudimageConfig;
}
export interface SliderState {
    position: number;
    isDragging: boolean;
    zoomLevel: number;
    panX: number;
    panY: number;
    isReady: boolean;
    isFullscreen: boolean;
}
export interface CIBeforeAfterElements {
    container: HTMLElement;
    viewport: HTMLElement;
    wrapper: HTMLElement;
    beforeImage: HTMLImageElement;
    afterImage: HTMLImageElement;
    clip: HTMLElement;
    handle: HTMLElement;
    handleGrip: HTMLElement;
    labelBefore: HTMLElement | null;
    labelAfter: HTMLElement | null;
}
export interface CIBeforeAfterInstance {
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
    update(config: Partial<CIBeforeAfterConfig>): void;
    destroy(): void;
}
