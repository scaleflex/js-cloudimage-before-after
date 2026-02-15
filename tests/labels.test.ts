import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CIBeforeAfterCore } from '../src/core/ci-before-after';
import { createLabels, updateLabelVisibility } from '../src/labels/labels';

describe('Labels', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('createLabels', () => {
    it('should create before and after labels', () => {
      const { before, after } = createLabels('Before', 'After', 'top', 'horizontal');

      expect(before.textContent).toBe('Before');
      expect(after.textContent).toBe('After');
      expect(before.classList.contains('ci-before-after-label-before')).toBe(true);
      expect(after.classList.contains('ci-before-after-label-after')).toBe(true);
    });

    it('should apply position class', () => {
      const { before, after } = createLabels('Before', 'After', 'bottom', 'horizontal');

      expect(before.classList.contains('ci-before-after-label--bottom')).toBe(true);
      expect(after.classList.contains('ci-before-after-label--bottom')).toBe(true);
    });

    it('should set aria-hidden', () => {
      const { before, after } = createLabels('Before', 'After', 'top', 'horizontal');

      expect(before.getAttribute('aria-hidden')).toBe('true');
      expect(after.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('updateLabelVisibility', () => {
    it('should hide before label when position < 15%', () => {
      const before = document.createElement('div');
      const after = document.createElement('div');

      updateLabelVisibility(before, after, 5, 'horizontal');
      expect(before.classList.contains('ci-before-after-label--hidden')).toBe(true);
      expect(after.classList.contains('ci-before-after-label--hidden')).toBe(false);
    });

    it('should hide after label when position > 85%', () => {
      const before = document.createElement('div');
      const after = document.createElement('div');

      updateLabelVisibility(before, after, 90, 'horizontal');
      expect(before.classList.contains('ci-before-after-label--hidden')).toBe(false);
      expect(after.classList.contains('ci-before-after-label--hidden')).toBe(true);
    });

    it('should show both labels at 50%', () => {
      const before = document.createElement('div');
      const after = document.createElement('div');

      updateLabelVisibility(before, after, 50, 'horizontal');
      expect(before.classList.contains('ci-before-after-label--hidden')).toBe(false);
      expect(after.classList.contains('ci-before-after-label--hidden')).toBe(false);
    });
  });

  describe('integration', () => {
    it('should render labels by default', () => {
      const instance = new CIBeforeAfterCore(container, {
        beforeSrc: '/before.jpg',
        afterSrc: '/after.jpg',
      });

      expect(container.querySelector('.ci-before-after-label-before')).toBeTruthy();
      expect(container.querySelector('.ci-before-after-label-after')).toBeTruthy();
      instance.destroy();
    });

    it('should not render labels when disabled', () => {
      const instance = new CIBeforeAfterCore(container, {
        beforeSrc: '/before.jpg',
        afterSrc: '/after.jpg',
        labels: false,
      });

      expect(container.querySelector('.ci-before-after-label-before')).toBeFalsy();
      expect(container.querySelector('.ci-before-after-label-after')).toBeFalsy();
      instance.destroy();
    });

    it('should render custom label text', () => {
      const instance = new CIBeforeAfterCore(container, {
        beforeSrc: '/before.jpg',
        afterSrc: '/after.jpg',
        labels: { before: 'Original', after: 'Edited' },
      });

      const beforeLabel = container.querySelector('.ci-before-after-label-before');
      const afterLabel = container.querySelector('.ci-before-after-label-after');
      expect(beforeLabel?.textContent).toBe('Original');
      expect(afterLabel?.textContent).toBe('Edited');
      instance.destroy();
    });
  });
});
