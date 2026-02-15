export declare class FullscreenManager {
    private container;
    private onFullscreenChange?;
    private button;
    private events;
    private isActive;
    constructor(container: HTMLElement, onFullscreenChange?: ((isFullscreen: boolean) => void) | undefined);
    private createButton;
    private bindEvents;
    private handleChange;
    enter(): Promise<void>;
    exit(): Promise<void>;
    toggle(): Promise<void>;
    getIsFullscreen(): boolean;
    destroy(): void;
}
