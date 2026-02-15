export declare function injectStyles(css: string): void;
export declare function createElement<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, attrs?: Record<string, string>): HTMLElementTagNameMap[K];
export declare function resolveElement(target: HTMLElement | string): HTMLElement;
export declare function isBrowser(): boolean;
export declare function supportsFullscreen(): boolean;
export declare function requestFullscreen(el: HTMLElement): Promise<void>;
export declare function exitFullscreen(): Promise<void>;
export declare function getFullscreenElement(): Element | null;
