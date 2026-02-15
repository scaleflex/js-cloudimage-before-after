export class EntranceAnimation {
  private observer: IntersectionObserver | null = null;
  private hasPlayed = false;
  private isAnimating = false;
  private delayTimer: ReturnType<typeof setTimeout> | null = null;
  private durationTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private container: HTMLElement,
    private duration: number,
    private delay: number,
    private easing: string,
    private animateOnce: boolean,
    private onAnimate: (skipTransition: boolean) => void,
  ) {
    this.observe();
  }

  private observe(): void {
    if (typeof IntersectionObserver === 'undefined') return;

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (this.animateOnce && this.hasPlayed) continue;
            if (this.isAnimating) continue;
            this.play();
          }
        }
      },
      { threshold: 0.3 },
    );

    this.observer.observe(this.container);
  }

  private play(): void {
    this.hasPlayed = true;
    this.isAnimating = true;

    // Check for reduced motion preference
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      this.onAnimate(true);
      this.isAnimating = false;
      if (this.animateOnce) {
        this.observer?.disconnect();
      }
      return;
    }

    this.container.classList.add('ci-before-after-animate-entrance');
    this.container.style.setProperty('--ci-before-after-animate-duration', `${this.duration}ms`);
    this.container.style.setProperty('--ci-before-after-animate-easing', this.easing);

    this.delayTimer = setTimeout(() => {
      this.delayTimer = null;
      this.onAnimate(false);

      this.durationTimer = setTimeout(() => {
        this.durationTimer = null;
        this.container.classList.remove('ci-before-after-animate-entrance');
        this.isAnimating = false;
        if (this.animateOnce) {
          this.observer?.disconnect();
        }
      }, this.duration);
    }, this.delay);
  }

  getHasPlayed(): boolean {
    return this.hasPlayed;
  }

  destroy(): void {
    if (this.delayTimer) clearTimeout(this.delayTimer);
    if (this.durationTimer) clearTimeout(this.durationTimer);
    this.delayTimer = null;
    this.durationTimer = null;
    this.isAnimating = false;
    this.container.classList.remove('ci-before-after-animate-entrance');
    this.container.style.removeProperty('--ci-before-after-animate-duration');
    this.container.style.removeProperty('--ci-before-after-animate-easing');
    this.observer?.disconnect();
    this.observer = null;
  }
}
