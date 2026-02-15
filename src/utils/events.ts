type EventCleanup = () => void;

export class EventManager {
  private cleanups: EventCleanup[] = [];

  on<K extends keyof HTMLElementEventMap>(
    el: HTMLElement | Window | Document,
    event: K,
    handler: (e: HTMLElementEventMap[K]) => void,
    options?: AddEventListenerOptions,
  ): void {
    el.addEventListener(event, handler as EventListener, options);
    this.cleanups.push(() => el.removeEventListener(event, handler as EventListener, options));
  }

  onPassive<K extends keyof HTMLElementEventMap>(
    el: HTMLElement | Window | Document,
    event: K,
    handler: (e: HTMLElementEventMap[K]) => void,
  ): void {
    this.on(el, event, handler, { passive: true });
  }

  onNonPassive<K extends keyof HTMLElementEventMap>(
    el: HTMLElement | Window | Document,
    event: K,
    handler: (e: HTMLElementEventMap[K]) => void,
  ): void {
    this.on(el, event, handler, { passive: false });
  }

  destroy(): void {
    for (const cleanup of this.cleanups) {
      cleanup();
    }
    this.cleanups = [];
  }
}

export function getPointerPosition(
  e: MouseEvent | TouchEvent,
  rect: DOMRect,
): { x: number; y: number } {
  let clientX: number;
  let clientY: number;

  if ('touches' in e) {
    const touch = e.touches[0] || e.changedTouches?.[0];
    if (!touch) return { x: 0, y: 0 };
    clientX = touch.clientX;
    clientY = touch.clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }

  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
}

export function getPositionPercent(
  e: MouseEvent | TouchEvent,
  rect: DOMRect,
  orientation: 'horizontal' | 'vertical',
): number {
  const { x, y } = getPointerPosition(e, rect);
  const dimension = orientation === 'horizontal' ? rect.width : rect.height;
  if (dimension === 0) return 50;
  const offset = orientation === 'horizontal' ? x : y;
  return Math.max(0, Math.min(100, (offset / dimension) * 100));
}
