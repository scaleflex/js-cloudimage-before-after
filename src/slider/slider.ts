import type { Orientation } from '../core/types';

export interface ClipZoomInfo {
  level: number;
  panX: number;
  panY: number;
  containerWidth: number;
  containerHeight: number;
}

export function updateClipPath(
  clipEl: HTMLElement,
  position: number,
  orientation: Orientation,
  zoom?: ClipZoomInfo,
): void {
  let adjusted = position;

  if (zoom && zoom.level > 1) {
    if (orientation === 'horizontal') {
      adjusted = position / zoom.level - zoom.panX * 100 / (zoom.level * zoom.containerWidth);
    } else {
      adjusted = position / zoom.level - zoom.panY * 100 / (zoom.level * zoom.containerHeight);
    }
    adjusted = Math.max(0, Math.min(100, adjusted));
  }

  const value = orientation === 'horizontal'
    ? `inset(0 0 0 ${adjusted}%)`
    : `inset(${adjusted}% 0 0 0)`;
  clipEl.style.clipPath = value;
  // Safari < 14 prefix (QUAL-03)
  clipEl.style.setProperty('-webkit-clip-path', value);
}

export function updateHandlePosition(
  handleEl: HTMLElement,
  position: number,
  orientation: Orientation,
): void {
  if (orientation === 'horizontal') {
    handleEl.style.left = `${position}%`;
    handleEl.style.top = '';
  } else {
    handleEl.style.top = `${position}%`;
    handleEl.style.left = '';
  }
}

export function clampPosition(value: number): number {
  if (!isFinite(value)) return 50;
  return Math.max(0, Math.min(100, value));
}
