import type { Orientation } from '../core/types';

export function updateAriaValue(handle: HTMLElement, position: number): void {
  handle.setAttribute('aria-valuenow', String(Math.round(position)));
}

export function updateAriaOrientation(handle: HTMLElement, orientation: Orientation): void {
  handle.setAttribute('aria-orientation', orientation);
}

export function setContainerAria(container: HTMLElement): void {
  container.setAttribute('role', 'group');
  container.setAttribute('aria-label', 'Before and after image comparison');
}
