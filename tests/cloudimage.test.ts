import { describe, it, expect } from 'vitest';
import { buildCloudimageUrl } from '../src/utils/cloudimage';

describe('Cloudimage URL Builder', () => {
  it('should build basic URL', () => {
    const url = buildCloudimageUrl('/image.jpg', 800, {
      token: 'demo',
    });

    expect(url).toContain('demo.cloudimg.io');
    expect(url).toContain('/v7/');
    expect(url).toContain('w=');
  });

  it('should round width to limitFactor', () => {
    const url = buildCloudimageUrl('/image.jpg', 750, {
      token: 'demo',
      limitFactor: 100,
    });

    // 750 should round up to 800
    expect(url).toContain('w=800');
  });

  it('should use custom domain', () => {
    const url = buildCloudimageUrl('/image.jpg', 800, {
      token: 'demo',
      domain: 'cdn.example.com',
    });

    expect(url).toContain('demo.cdn.example.com');
  });

  it('should use custom API version', () => {
    const url = buildCloudimageUrl('/image.jpg', 800, {
      token: 'demo',
      apiVersion: 'v8',
    });

    expect(url).toContain('/v8/');
  });

  it('should append custom params', () => {
    const url = buildCloudimageUrl('/image.jpg', 800, {
      token: 'demo',
      params: 'q=80&org_if_sml=1',
    });

    expect(url).toContain('q=80&org_if_sml=1');
  });

  it('should handle absolute URLs', () => {
    const url = buildCloudimageUrl('https://example.com/image.jpg', 800, {
      token: 'demo',
    });

    expect(url).toContain('demo.cloudimg.io');
    expect(url).toContain('https://example.com/image.jpg');
  });
});
