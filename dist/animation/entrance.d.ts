export declare class EntranceAnimation {
    private container;
    private duration;
    private delay;
    private easing;
    private animateOnce;
    private onAnimate;
    private observer;
    private hasPlayed;
    private isAnimating;
    private delayTimer;
    private durationTimer;
    constructor(container: HTMLElement, duration: number, delay: number, easing: string, animateOnce: boolean, onAnimate: (skipTransition: boolean) => void);
    private observe;
    private play;
    getHasPlayed(): boolean;
    destroy(): void;
}
