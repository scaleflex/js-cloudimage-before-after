import { createElement } from '../utils/dom';

export class ScrollHint {
  private el: HTMLElement;
  private timeout: ReturnType<typeof setTimeout> | null = null;

  constructor(container: HTMLElement) {
    this.el = createElement('div', 'ci-before-after-scroll-hint', {
      'aria-hidden': 'true',
    });

    const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
    this.el.textContent = isMac
      ? '\u2318 + scroll or pinch to zoom'
      : 'Ctrl + scroll or pinch to zoom';

    container.appendChild(this.el);
  }

  show(): void {
    if (this.timeout) clearTimeout(this.timeout);

    this.el.classList.add('ci-before-after-scroll-hint--visible');

    this.timeout = setTimeout(() => {
      this.el.classList.remove('ci-before-after-scroll-hint--visible');
      this.timeout = null;
    }, 1500);
  }

  destroy(): void {
    if (this.timeout) clearTimeout(this.timeout);
    this.el.remove();
  }
}
