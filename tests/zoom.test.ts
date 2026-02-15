import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CIBeforeAfterCore } from '../src/core/ci-before-after';

describe('Zoom & Pan', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('should return zoom level 1 by default', () => {
    const instance = new CIBeforeAfterCore(container, {
      beforeSrc: '/before.jpg',
      afterSrc: '/after.jpg',
    });

    expect(instance.getZoom()).toBe(1);
    instance.destroy();
  });

  it('should create zoom controls when zoom is enabled', () => {
    const instance = new CIBeforeAfterCore(container, {
      beforeSrc: '/before.jpg',
      afterSrc: '/after.jpg',
      zoom: true,
    });

    expect(container.querySelector('.ci-before-after-zoom-controls')).toBeTruthy();
    expect(container.querySelector('.ci-before-after-zoom-in')).toBeTruthy();
    expect(container.querySelector('.ci-before-after-zoom-out')).toBeTruthy();
    expect(container.querySelector('.ci-before-after-zoom-reset')).toBeTruthy();
    instance.destroy();
  });

  it('should not create zoom controls when zoom is disabled', () => {
    const instance = new CIBeforeAfterCore(container, {
      beforeSrc: '/before.jpg',
      afterSrc: '/after.jpg',
      zoom: false,
    });

    expect(container.querySelector('.ci-before-after-zoom-controls')).toBeFalsy();
    instance.destroy();
  });

  it('should create scroll hint when zoom and scrollHint enabled', () => {
    const instance = new CIBeforeAfterCore(container, {
      beforeSrc: '/before.jpg',
      afterSrc: '/after.jpg',
      zoom: true,
      scrollHint: true,
    });

    expect(container.querySelector('.ci-before-after-scroll-hint')).toBeTruthy();
    instance.destroy();
  });
});
