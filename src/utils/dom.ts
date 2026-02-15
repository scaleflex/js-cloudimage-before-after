export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  attrs?: Record<string, string>,
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      el.setAttribute(key, value);
    }
  }
  return el;
}

export function resolveElement(target: HTMLElement | string): HTMLElement {
  if (typeof target === 'string') {
    const el = document.querySelector<HTMLElement>(target);
    if (!el) {
      throw new Error(`CIBeforeAfter: Element not found for selector "${target}"`);
    }
    return el;
  }
  return target;
}

export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export function supportsFullscreen(): boolean {
  if (!isBrowser()) return false;
  const doc = document as Document & {
    webkitFullscreenEnabled?: boolean;
  };
  return !!(doc.fullscreenEnabled || doc.webkitFullscreenEnabled);
}

export function requestFullscreen(el: HTMLElement): Promise<void> {
  const elem = el as HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void>;
  };
  if (elem.requestFullscreen) return elem.requestFullscreen();
  if (elem.webkitRequestFullscreen) return elem.webkitRequestFullscreen();
  return Promise.reject(new Error('Fullscreen API not supported'));
}

export function exitFullscreen(): Promise<void> {
  const doc = document as Document & {
    webkitExitFullscreen?: () => Promise<void>;
  };
  if (doc.exitFullscreen) return doc.exitFullscreen();
  if (doc.webkitExitFullscreen) return doc.webkitExitFullscreen();
  return Promise.reject(new Error('Fullscreen API not supported'));
}

export function getFullscreenElement(): Element | null {
  const doc = document as Document & {
    webkitFullscreenElement?: Element;
  };
  return doc.fullscreenElement || doc.webkitFullscreenElement || null;
}
