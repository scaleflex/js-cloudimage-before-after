import { describe, it, expect } from 'vitest';
import { updateClipPath, updateHandlePosition, clampPosition, type ClipZoomInfo } from '../src/slider/slider';

describe('Slider', () => {
  describe('updateClipPath', () => {
    it('should set horizontal clip-path', () => {
      const el = document.createElement('div');
      updateClipPath(el, 50, 'horizontal');
      expect(el.style.clipPath).toBe('inset(0 0 0 50%)');
    });

    it('should set vertical clip-path', () => {
      const el = document.createElement('div');
      updateClipPath(el, 30, 'vertical');
      expect(el.style.clipPath).toBe('inset(30% 0 0 0)');
    });

    it('should handle 0% position', () => {
      const el = document.createElement('div');
      updateClipPath(el, 0, 'horizontal');
      expect(el.style.clipPath).toBe('inset(0 0 0 0%)');
    });

    it('should handle 100% position', () => {
      const el = document.createElement('div');
      updateClipPath(el, 100, 'horizontal');
      expect(el.style.clipPath).toBe('inset(0 0 0 100%)');
    });
  });

  describe('updateClipPath with zoom', () => {
    const makeZoom = (overrides?: Partial<ClipZoomInfo>): ClipZoomInfo => ({
      level: 2,
      panX: 0,
      panY: 0,
      containerWidth: 800,
      containerHeight: 600,
      ...overrides,
    });

    it('should adjust horizontal clip-path for zoom level', () => {
      const el = document.createElement('div');
      // At 2x zoom with no pan: clip = 50 / 2 = 25%
      updateClipPath(el, 50, 'horizontal', makeZoom());
      expect(el.style.clipPath).toBe('inset(0 0 0 25%)');
    });

    it('should adjust vertical clip-path for zoom level', () => {
      const el = document.createElement('div');
      // At 2x zoom with no pan: clip = 50 / 2 = 25%
      updateClipPath(el, 50, 'vertical', makeZoom());
      expect(el.style.clipPath).toBe('inset(25% 0 0 0)');
    });

    it('should account for horizontal pan offset', () => {
      const el = document.createElement('div');
      // At 2x zoom, panX = -400 (panned left by half container width)
      // clip = 50/2 - (-400)*100/(2*800) = 25 + 25 = 50%
      updateClipPath(el, 50, 'horizontal', makeZoom({ panX: -400 }));
      expect(el.style.clipPath).toBe('inset(0 0 0 50%)');
    });

    it('should account for vertical pan offset', () => {
      const el = document.createElement('div');
      // At 2x zoom, panY = -300 (panned up by half container height)
      // clip = 50/2 - (-300)*100/(2*600) = 25 + 25 = 50%
      updateClipPath(el, 50, 'vertical', makeZoom({ panY: -300 }));
      expect(el.style.clipPath).toBe('inset(50% 0 0 0)');
    });

    it('should clamp adjusted clip to 0 minimum', () => {
      const el = document.createElement('div');
      // At 3x zoom, position 10: clip = 10/3 ≈ 3.33, with large positive pan pushing it negative
      updateClipPath(el, 10, 'horizontal', makeZoom({ level: 3, panX: 800 }));
      expect(el.style.clipPath).toBe('inset(0 0 0 0%)');
    });

    it('should clamp adjusted clip to 100 maximum', () => {
      const el = document.createElement('div');
      // At 2x zoom, position 100 with large negative pan
      updateClipPath(el, 100, 'horizontal', makeZoom({ panX: -1600 }));
      expect(el.style.clipPath).toBe('inset(0 0 0 100%)');
    });

    it('should not adjust when zoom level is 1', () => {
      const el = document.createElement('div');
      updateClipPath(el, 50, 'horizontal', makeZoom({ level: 1 }));
      // level <= 1 guard: no adjustment
      expect(el.style.clipPath).toBe('inset(0 0 0 50%)');
    });

    it('should not adjust when zoom info is undefined', () => {
      const el = document.createElement('div');
      updateClipPath(el, 50, 'horizontal', undefined);
      expect(el.style.clipPath).toBe('inset(0 0 0 50%)');
    });

    it('should handle high zoom levels correctly', () => {
      const el = document.createElement('div');
      // At 4x zoom with no pan: clip = 50 / 4 = 12.5%
      updateClipPath(el, 50, 'horizontal', makeZoom({ level: 4 }));
      expect(el.style.clipPath).toBe('inset(0 0 0 12.5%)');
    });

    it('should use panX for horizontal and panY for vertical independently', () => {
      const elH = document.createElement('div');
      const elV = document.createElement('div');
      const zoom = makeZoom({ panX: -200, panY: -150 });

      updateClipPath(elH, 50, 'horizontal', zoom);
      updateClipPath(elV, 50, 'vertical', zoom);

      // Horizontal uses panX: 50/2 - (-200)*100/(2*800) = 25 + 12.5 = 37.5%
      expect(elH.style.clipPath).toBe('inset(0 0 0 37.5%)');
      // Vertical uses panY: 50/2 - (-150)*100/(2*600) = 25 + 12.5 = 37.5%
      expect(elV.style.clipPath).toBe('inset(37.5% 0 0 0)');
    });
  });

  describe('updateHandlePosition', () => {
    it('should set left for horizontal', () => {
      const el = document.createElement('div');
      updateHandlePosition(el, 50, 'horizontal');
      expect(el.style.left).toBe('50%');
    });

    it('should set top for vertical', () => {
      const el = document.createElement('div');
      updateHandlePosition(el, 50, 'vertical');
      expect(el.style.top).toBe('50%');
    });
  });

  describe('clampPosition', () => {
    it('should clamp below 0', () => {
      expect(clampPosition(-10)).toBe(0);
    });

    it('should clamp above 100', () => {
      expect(clampPosition(150)).toBe(100);
    });

    it('should pass through valid values', () => {
      expect(clampPosition(50)).toBe(50);
      expect(clampPosition(0)).toBe(0);
      expect(clampPosition(100)).toBe(100);
    });
  });
});
