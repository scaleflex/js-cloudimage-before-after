import type { HandleStyle, Orientation } from '../core/types';
import { createElement } from '../utils/dom';

const CHEVRON_LEFT = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>';
const CHEVRON_RIGHT = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';
const CHEVRON_UP = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>';
const CHEVRON_DOWN = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
const MOVE_HORIZONTAL = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 8 22 12 18 16"/><polyline points="6 8 2 12 6 16"/><line x1="2" x2="22" y1="12" y2="12"/></svg>';
const MOVE_VERTICAL = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="8 18 12 22 16 18"/><polyline points="8 6 12 2 16 6"/><line x1="12" x2="12" y1="2" y2="22"/></svg>';

export function createHandle(
  style: HandleStyle,
  orientation: Orientation,
  position: number,
): HTMLElement {
  const handle = createElement('div', `ci-before-after-handle ci-before-after-handle--${style}`, {
    role: 'slider',
    'aria-valuenow': String(Math.round(position)),
    'aria-valuemin': '0',
    'aria-valuemax': '100',
    'aria-label': 'Image comparison slider. Use arrow keys to adjust the before and after split position.',
    'aria-orientation': orientation,
    tabindex: '0',
  });

  if (orientation === 'horizontal') {
    handle.style.left = `${position}%`;
  } else {
    handle.style.top = `${position}%`;
  }

  switch (style) {
    case 'arrows':
      buildArrowsHandle(handle, orientation);
      break;
    case 'circle':
      buildCircleHandle(handle, orientation);
      break;
    case 'line':
      buildLineHandle(handle);
      break;
  }

  return handle;
}

function buildArrowsHandle(handle: HTMLElement, orientation: Orientation): void {
  const line1 = createElement('div', 'ci-before-after-handle-line');
  const grip = createElement('div', 'ci-before-after-handle-grip');
  const line2 = createElement('div', 'ci-before-after-handle-line');

  if (orientation === 'horizontal') {
    grip.innerHTML = CHEVRON_LEFT + CHEVRON_RIGHT;
  } else {
    grip.innerHTML = CHEVRON_UP + CHEVRON_DOWN;
  }

  handle.append(line1, grip, line2);
}

function buildCircleHandle(handle: HTMLElement, orientation: Orientation): void {
  const grip = createElement('div', 'ci-before-after-handle-grip');

  if (orientation === 'horizontal') {
    grip.innerHTML = MOVE_HORIZONTAL;
  } else {
    grip.innerHTML = MOVE_VERTICAL;
  }

  handle.append(grip);
}

function buildLineHandle(handle: HTMLElement): void {
  const line1 = createElement('div', 'ci-before-after-handle-line');
  const grip = createElement('div', 'ci-before-after-handle-grip ci-before-after-handle-grip--pill');
  const line2 = createElement('div', 'ci-before-after-handle-line');

  handle.append(line1, grip, line2);
}
