import type { LabelPosition, Orientation } from '../core/types';
import { createElement } from '../utils/dom';

export function createLabels(
  beforeText: string,
  afterText: string,
  position: LabelPosition,
  orientation: Orientation,
): { before: HTMLElement; after: HTMLElement } {
  const posClass = `ci-before-after-label--${position}`;

  const beforeLabel = createElement('div',
    `ci-before-after-label ci-before-after-label-before ${posClass}`,
    { 'aria-hidden': 'true' },
  );
  beforeLabel.textContent = beforeText;

  const afterLabel = createElement('div',
    `ci-before-after-label ci-before-after-label-after ${posClass}`,
    { 'aria-hidden': 'true' },
  );
  afterLabel.textContent = afterText;

  return { before: beforeLabel, after: afterLabel };
}

export function updateLabelVisibility(
  beforeLabel: HTMLElement | null,
  afterLabel: HTMLElement | null,
  position: number,
  orientation: Orientation,
): void {
  if (!beforeLabel || !afterLabel) return;

  const fadeThreshold = 15;

  // Before label is near the left/top edge — fade when handle is close to 0%
  if (position < fadeThreshold) {
    beforeLabel.classList.add('ci-before-after-label--hidden');
  } else {
    beforeLabel.classList.remove('ci-before-after-label--hidden');
  }

  // After label is near the right/bottom edge — fade when handle is close to 100%
  if (position > 100 - fadeThreshold) {
    afterLabel.classList.add('ci-before-after-label--hidden');
  } else {
    afterLabel.classList.remove('ci-before-after-label--hidden');
  }
}
