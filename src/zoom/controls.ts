import type { ZoomControlsPosition } from '../core/types';
import { createElement } from '../utils/dom';
import { EventManager } from '../utils/events';

const PLUS_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>';
const MINUS_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>';
const RESET_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>';

export interface ZoomControlsCallbacks {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export interface ZoomControlsResult {
  element: HTMLElement;
  events: EventManager;
}

export function createZoomControls(
  position: ZoomControlsPosition,
  callbacks: ZoomControlsCallbacks,
): ZoomControlsResult {
  const events = new EventManager();
  const wrapper = createElement('div', `ci-before-after-zoom-controls ci-before-after-zoom-controls--${position}`);

  const zoomInBtn = createElement('button', 'ci-before-after-zoom-in', {
    type: 'button',
    'aria-label': 'Zoom in',
  });
  zoomInBtn.innerHTML = PLUS_ICON;
  events.on(zoomInBtn, 'click', callbacks.onZoomIn);

  const zoomOutBtn = createElement('button', 'ci-before-after-zoom-out', {
    type: 'button',
    'aria-label': 'Zoom out',
  });
  zoomOutBtn.innerHTML = MINUS_ICON;
  events.on(zoomOutBtn, 'click', callbacks.onZoomOut);

  const resetBtn = createElement('button', 'ci-before-after-zoom-reset', {
    type: 'button',
    'aria-label': 'Reset zoom',
  });
  resetBtn.innerHTML = RESET_ICON;
  events.on(resetBtn, 'click', callbacks.onReset);

  wrapper.append(zoomInBtn, zoomOutBtn, resetBtn);
  return { element: wrapper, events };
}
