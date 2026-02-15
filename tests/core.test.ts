import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CIBeforeAfterCore } from '../src/core/ci-before-after';

describe('CIBeforeAfterCore', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('should initialize with a DOM element', () => {
    const instance = new CIBeforeAfterCore(container, {
      beforeSrc: '/before.jpg',
      afterSrc: '/after.jpg',
    });

    expect(container.classList.contains('ci-before-after-container')).toBe(true);
    instance.destroy();
  });

  it('should initialize with a CSS selector', () => {
    container.id = 'test-slider';
    const instance = new CIBeforeAfterCore('#test-slider', {
      beforeSrc: '/before.jpg',
      afterSrc: '/after.jpg',
    });

    expect(container.classList.contains('ci-before-after-container')).toBe(true);
    instance.destroy();
  });

  it('should throw for invalid selector', () => {
    expect(() => {
      new CIBeforeAfterCore('#nonexistent', {
        beforeSrc: '/before.jpg',
        afterSrc: '/after.jpg',
      });
    }).toThrow('Element not found');
  });

  it('should create expected DOM structure', () => {
    const instance = new CIBeforeAfterCore(container, {
      beforeSrc: '/before.jpg',
      afterSrc: '/after.jpg',
    });

    expect(container.querySelector('.ci-before-after-viewport')).toBeTruthy();
    expect(container.querySelector('.ci-before-after-wrapper')).toBeTruthy();
    expect(container.querySelector('.ci-before-after-before')).toBeTruthy();
    expect(container.querySelector('.ci-before-after-after')).toBeTruthy();
    expect(container.querySelector('.ci-before-after-clip')).toBeTruthy();
    expect(container.querySelector('.ci-before-after-handle')).toBeTruthy();
    instance.destroy();
  });

  it('should set default position to 50%', () => {
    const instance = new CIBeforeAfterCore(container, {
      beforeSrc: '/before.jpg',
      afterSrc: '/after.jpg',
    });

    expect(instance.getPosition()).toBe(50);
    instance.destroy();
  });

  it('should accept custom initial position', () => {
    const instance = new CIBeforeAfterCore(container, {
      beforeSrc: '/before.jpg',
      afterSrc: '/after.jpg',
      initialPosition: 25,
    });

    expect(instance.getPosition()).toBe(25);
    instance.destroy();
  });

  it('should set position programmatically', () => {
    const instance = new CIBeforeAfterCore(container, {
      beforeSrc: '/before.jpg',
      afterSrc: '/after.jpg',
    });

    instance.setPosition(75);
    expect(instance.getPosition()).toBe(75);
    instance.destroy();
  });

  it('should clamp position to 0-100', () => {
    const instance = new CIBeforeAfterCore(container, {
      beforeSrc: '/before.jpg',
      afterSrc: '/after.jpg',
    });

    instance.setPosition(-10);
    expect(instance.getPosition()).toBe(0);

    instance.setPosition(150);
    expect(instance.getPosition()).toBe(100);

    instance.destroy();
  });

  it('should add horizontal class by default', () => {
    const instance = new CIBeforeAfterCore(container, {
      beforeSrc: '/before.jpg',
      afterSrc: '/after.jpg',
    });

    expect(container.classList.contains('ci-before-after-container--horizontal')).toBe(true);
    instance.destroy();
  });

  it('should add vertical class when specified', () => {
    const instance = new CIBeforeAfterCore(container, {
      beforeSrc: '/before.jpg',
      afterSrc: '/after.jpg',
      orientation: 'vertical',
    });

    expect(container.classList.contains('ci-before-after-container--vertical')).toBe(true);
    instance.destroy();
  });

  it('should apply dark theme class', () => {
    const instance = new CIBeforeAfterCore(container, {
      beforeSrc: '/before.jpg',
      afterSrc: '/after.jpg',
      theme: 'dark',
    });

    expect(container.classList.contains('ci-before-after-theme-dark')).toBe(true);
    instance.destroy();
  });

  it('should clean up DOM on destroy', () => {
    const instance = new CIBeforeAfterCore(container, {
      beforeSrc: '/before.jpg',
      afterSrc: '/after.jpg',
    });

    instance.destroy();

    expect(container.querySelector('.ci-before-after-viewport')).toBeFalsy();
    expect(container.querySelector('.ci-before-after-handle')).toBeFalsy();
  });

  it('should update config via update()', () => {
    const instance = new CIBeforeAfterCore(container, {
      beforeSrc: '/before.jpg',
      afterSrc: '/after.jpg',
      theme: 'light',
    });

    instance.update({ theme: 'dark' });
    expect(container.classList.contains('ci-before-after-theme-dark')).toBe(true);

    instance.destroy();
  });
});
