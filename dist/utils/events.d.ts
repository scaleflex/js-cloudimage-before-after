export declare class EventManager {
    private cleanups;
    on<K extends keyof HTMLElementEventMap>(el: HTMLElement | Window | Document, event: K, handler: (e: HTMLElementEventMap[K]) => void, options?: AddEventListenerOptions): void;
    onPassive<K extends keyof HTMLElementEventMap>(el: HTMLElement | Window | Document, event: K, handler: (e: HTMLElementEventMap[K]) => void): void;
    onNonPassive<K extends keyof HTMLElementEventMap>(el: HTMLElement | Window | Document, event: K, handler: (e: HTMLElementEventMap[K]) => void): void;
    destroy(): void;
}
export declare function getPointerPosition(e: MouseEvent | TouchEvent, rect: DOMRect): {
    x: number;
    y: number;
};
export declare function getPositionPercent(e: MouseEvent | TouchEvent, rect: DOMRect, orientation: 'horizontal' | 'vertical'): number;
