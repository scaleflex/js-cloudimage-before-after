import { useRef, useEffect } from 'react';
import type { CIBeforeAfterConfig, CIBeforeAfterInstance } from '../core/types';

export function useCIBeforeAfter(config: CIBeforeAfterConfig) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instance = useRef<CIBeforeAfterInstance | null>(null);
  const pendingConfigRef = useRef<Partial<CIBeforeAfterConfig> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;
    let inst: CIBeforeAfterInstance | null = null;

    import('../index').then(
      ({ default: CIBeforeAfter }) => {
        // BUG-04: Guard against mount/unmount race
        if (cancelled || !containerRef.current) return;
        inst = new CIBeforeAfter(containerRef.current, config);
        instance.current = inst;

        // Apply any config changes that arrived during async import
        if (pendingConfigRef.current) {
          inst.update(pendingConfigRef.current);
          pendingConfigRef.current = null;
        }
      },
      () => { /* dynamic import failed — hook stays empty */ },
    );

    return () => {
      cancelled = true;
      inst?.destroy();
      instance.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update config when props change
  useEffect(() => {
    if (!instance.current) {
      // Instance not yet initialized — store for later application
      pendingConfigRef.current = config;
      return;
    }
    instance.current.update(config);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    config.beforeSrc,
    config.afterSrc,
    config.beforeAlt,
    config.afterAlt,
    config.mode,
    config.orientation,
    config.initialPosition,
    config.zoom,
    config.zoomMax,
    config.zoomMin,
    config.theme,
    config.handleStyle,
    config.labels,
    config.labelPosition,
    config.fullscreenButton,
    config.lazyLoad,
    config.zoomControls,
    config.zoomControlsPosition,
    config.scrollHint,
    config.keyboardStep,
    config.keyboardLargeStep,
    config.animate,
    config.animateOnce,
    config.cloudimage,
    config.onSlide,
    config.onZoom,
    config.onFullscreenChange,
    config.onReady,
  ]);

  return { containerRef, instance };
}
