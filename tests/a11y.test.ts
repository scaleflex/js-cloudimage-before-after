import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CIBeforeAfterCore } from '../src/core/ci-before-after';

describe('Accessibility', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('should set role="group" on container', () => {
    const instance = new CIBeforeAfterCore(container, {
      beforeSrc: '/before.jpg',
      afterSrc: '/after.jpg',
    });

    expect(container.getAttribute('role')).toBe('group');
    expect(container.getAttribute('aria-label')).toBe('Before and after image comparison');
    instance.destroy();
  });

  it('should set role="slider" on handle', () => {
    const instance = new CIBeforeAfterCore(container, {
      beforeSrc: '/before.jpg',
      afterSrc: '/after.jpg',
    });

    const handle = container.querySelector('.ci-before-after-handle')!;
    expect(handle.getAttribute('role')).toBe('slider');
    expect(handle.getAttribute('aria-valuenow')).toBe('50');
    expect(handle.getAttribute('aria-valuemin')).toBe('0');
    expect(handle.getAttribute('aria-valuemax')).toBe('100');
    expect(handle.getAttribute('aria-orientation')).toBe('horizontal');
    expect(handle.getAttribute('tabindex')).toBe('0');
    instance.destroy();
  });

  it('should update aria-valuenow when position changes', () => {
    const instance = new CIBeforeAfterCore(container, {
      beforeSrc: '/before.jpg',
      afterSrc: '/after.jpg',
    });

    instance.setPosition(75);
    const handle = container.querySelector('.ci-before-after-handle')!;
    expect(handle.getAttribute('aria-valuenow')).toBe('75');
    instance.destroy();
  });

  it('should set vertical aria-orientation', () => {
    const instance = new CIBeforeAfterCore(container, {
      beforeSrc: '/before.jpg',
      afterSrc: '/after.jpg',
      orientation: 'vertical',
    });

    const handle = container.querySelector('.ci-before-after-handle')!;
    expect(handle.getAttribute('aria-orientation')).toBe('vertical');
    instance.destroy();
  });

  it('should set alt text on images', () => {
    const instance = new CIBeforeAfterCore(container, {
      beforeSrc: '/before.jpg',
      afterSrc: '/after.jpg',
      beforeAlt: 'Before image',
      afterAlt: 'After image',
    });

    const beforeImg = container.querySelector('.ci-before-after-before') as HTMLImageElement;
    const afterImg = container.querySelector('.ci-before-after-after') as HTMLImageElement;

    expect(beforeImg.getAttribute('alt')).toBe('Before image');
    expect(afterImg.getAttribute('alt')).toBe('After image');
    instance.destroy();
  });

  it('should make labels aria-hidden', () => {
    const instance = new CIBeforeAfterCore(container, {
      beforeSrc: '/before.jpg',
      afterSrc: '/after.jpg',
      labels: true,
    });

    const labels = container.querySelectorAll('.ci-before-after-label');
    labels.forEach((label) => {
      expect(label.getAttribute('aria-hidden')).toBe('true');
    });
    instance.destroy();
  });
});
