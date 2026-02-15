import { createElement, supportsFullscreen, requestFullscreen, exitFullscreen, getFullscreenElement } from '../utils/dom';
import { EventManager } from '../utils/events';

const MAXIMIZE_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/></svg>';
const MINIMIZE_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" x2="21" y1="10" y2="3"/><line x1="3" x2="10" y1="21" y2="14"/></svg>';

export class FullscreenManager {
  private button: HTMLElement | null = null;
  private events = new EventManager();
  private isActive = false;

  constructor(
    private container: HTMLElement,
    private onFullscreenChange?: (isFullscreen: boolean) => void,
  ) {
    if (!supportsFullscreen()) return;
    this.createButton();
    this.bindEvents();
  }

  private createButton(): void {
    this.button = createElement('button', 'ci-before-after-fullscreen-btn', {
      type: 'button',
      'aria-label': 'Enter fullscreen',
      'aria-pressed': 'false',
    });
    this.button.innerHTML = MAXIMIZE_ICON;
    this.events.on(this.button, 'click', () => { this.toggle().catch(() => {}); });
    this.container.appendChild(this.button);
  }

  private bindEvents(): void {
    this.events.on(document as unknown as HTMLElement, 'fullscreenchange', () => this.handleChange());
    this.events.on(document as unknown as HTMLElement, 'webkitfullscreenchange' as keyof HTMLElementEventMap, () => this.handleChange());
  }

  private handleChange(): void {
    const fsElement = getFullscreenElement();
    const wasActive = this.isActive;
    this.isActive = fsElement === this.container;

    // Only fire callback and update UI when this instance's state actually changed
    if (wasActive === this.isActive) return;

    this.container.classList.toggle('ci-before-after-container--fullscreen', this.isActive);

    if (this.button) {
      this.button.innerHTML = this.isActive ? MINIMIZE_ICON : MAXIMIZE_ICON;
      this.button.setAttribute('aria-label', this.isActive ? 'Exit fullscreen' : 'Enter fullscreen');
      this.button.setAttribute('aria-pressed', String(this.isActive));
    }

    this.onFullscreenChange?.(this.isActive);
  }

  async enter(): Promise<void> {
    if (!supportsFullscreen()) return;
    await requestFullscreen(this.container);
  }

  async exit(): Promise<void> {
    if (!supportsFullscreen()) return;
    if (getFullscreenElement() === this.container) {
      await exitFullscreen();
    }
  }

  async toggle(): Promise<void> {
    if (this.isActive) {
      await this.exit();
    } else {
      await this.enter();
    }
  }

  getIsFullscreen(): boolean {
    return this.isActive;
  }

  destroy(): void {
    const wasActive = this.isActive;
    this.events.destroy();
    if (wasActive) {
      this.isActive = false;
      this.onFullscreenChange?.(false);
      exitFullscreen().catch(() => {});
    }
    this.container.classList.remove('ci-before-after-container--fullscreen');
    this.button?.remove();
  }
}
