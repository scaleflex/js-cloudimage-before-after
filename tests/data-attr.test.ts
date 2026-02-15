import { describe, it, expect } from 'vitest';
import { parseDataAttributes } from '../src/core/config';

describe('Data Attribute Parsing', () => {
  it('should parse required src attributes', () => {
    const el = document.createElement('div');
    el.setAttribute('data-ci-before-after-before-src', '/before.jpg');
    el.setAttribute('data-ci-before-after-after-src', '/after.jpg');

    const config = parseDataAttributes(el);
    expect(config.beforeSrc).toBe('/before.jpg');
    expect(config.afterSrc).toBe('/after.jpg');
  });

  it('should throw when required attributes are missing', () => {
    const el = document.createElement('div');
    expect(() => parseDataAttributes(el)).toThrow();
  });

  it('should parse mode', () => {
    const el = document.createElement('div');
    el.setAttribute('data-ci-before-after-before-src', '/before.jpg');
    el.setAttribute('data-ci-before-after-after-src', '/after.jpg');
    el.setAttribute('data-ci-before-after-mode', 'hover');

    const config = parseDataAttributes(el);
    expect(config.mode).toBe('hover');
  });

  it('should parse orientation', () => {
    const el = document.createElement('div');
    el.setAttribute('data-ci-before-after-before-src', '/before.jpg');
    el.setAttribute('data-ci-before-after-after-src', '/after.jpg');
    el.setAttribute('data-ci-before-after-orientation', 'vertical');

    const config = parseDataAttributes(el);
    expect(config.orientation).toBe('vertical');
  });

  it('should parse boolean attributes', () => {
    const el = document.createElement('div');
    el.setAttribute('data-ci-before-after-before-src', '/before.jpg');
    el.setAttribute('data-ci-before-after-after-src', '/after.jpg');
    el.setAttribute('data-ci-before-after-zoom', 'true');
    el.setAttribute('data-ci-before-after-labels', 'false');

    const config = parseDataAttributes(el);
    expect(config.zoom).toBe(true);
    expect(config.labels).toBe(false);
  });

  it('should parse numeric attributes', () => {
    const el = document.createElement('div');
    el.setAttribute('data-ci-before-after-before-src', '/before.jpg');
    el.setAttribute('data-ci-before-after-after-src', '/after.jpg');
    el.setAttribute('data-ci-before-after-initial-position', '75');
    el.setAttribute('data-ci-before-after-zoom-max', '6');

    const config = parseDataAttributes(el);
    expect(config.initialPosition).toBe(75);
    expect(config.zoomMax).toBe(6);
  });

  it('should parse custom label text', () => {
    const el = document.createElement('div');
    el.setAttribute('data-ci-before-after-before-src', '/before.jpg');
    el.setAttribute('data-ci-before-after-after-src', '/after.jpg');
    el.setAttribute('data-ci-before-after-label-before', 'Original');
    el.setAttribute('data-ci-before-after-label-after', 'Edited');

    const config = parseDataAttributes(el);
    expect(config.labels).toEqual({ before: 'Original', after: 'Edited' });
  });

  it('should parse theme', () => {
    const el = document.createElement('div');
    el.setAttribute('data-ci-before-after-before-src', '/before.jpg');
    el.setAttribute('data-ci-before-after-after-src', '/after.jpg');
    el.setAttribute('data-ci-before-after-theme', 'dark');

    const config = parseDataAttributes(el);
    expect(config.theme).toBe('dark');
  });

  it('should parse cloudimage config', () => {
    const el = document.createElement('div');
    el.setAttribute('data-ci-before-after-before-src', '/before.jpg');
    el.setAttribute('data-ci-before-after-after-src', '/after.jpg');
    el.setAttribute('data-ci-before-after-ci-token', 'demo');
    el.setAttribute('data-ci-before-after-ci-domain', 'cdn.example.com');

    const config = parseDataAttributes(el);
    expect(config.cloudimage?.token).toBe('demo');
    expect(config.cloudimage?.domain).toBe('cdn.example.com');
  });
});
