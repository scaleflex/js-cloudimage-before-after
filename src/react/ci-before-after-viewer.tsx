import { forwardRef, useRef, useEffect, useImperativeHandle } from 'react';
import type { CIBeforeAfterViewerProps, CIBeforeAfterViewerRef } from './types';
import type { CIBeforeAfterConfig, CIBeforeAfterInstance } from '../core/types';

export const CIBeforeAfterViewer = forwardRef<CIBeforeAfterViewerRef, CIBeforeAfterViewerProps>(
  function CIBeforeAfterViewer(props, ref) {
    const {
      className,
      style,
      onSlide,
      onZoom,
      onFullscreenChange,
      onReady,
      ...configProps
    } = props;

    const containerRef = useRef<HTMLDivElement>(null);
    const instanceRef = useRef<CIBeforeAfterInstance | null>(null);
    const pendingConfigRef = useRef<Partial<CIBeforeAfterConfig> | null>(null);

    useImperativeHandle(ref, () => ({
      getElements: () => {
        if (!instanceRef.current) throw new Error('CIBeforeAfter: instance not yet initialized');
        return instanceRef.current.getElements();
      },
      setPosition: (p: number) => instanceRef.current?.setPosition(p),
      getPosition: () => instanceRef.current?.getPosition() ?? 50,
      setZoom: (l: number) => instanceRef.current?.setZoom(l),
      getZoom: () => instanceRef.current?.getZoom() ?? 1,
      resetZoom: () => instanceRef.current?.resetZoom(),
      enterFullscreen: () => instanceRef.current?.enterFullscreen(),
      exitFullscreen: () => instanceRef.current?.exitFullscreen(),
      isFullscreen: () => instanceRef.current?.isFullscreen() ?? false,
      update: (c: Partial<CIBeforeAfterConfig>) => instanceRef.current?.update(c),
      destroy: () => instanceRef.current?.destroy(),
    }));

    useEffect(() => {
      if (!containerRef.current) return;

      let cancelled = false;
      let inst: CIBeforeAfterInstance | null = null;

      import('../core/ci-before-after').then(
        ({ CIBeforeAfterCore }) => {
          // BUG-04: Guard against mount/unmount race
          if (cancelled || !containerRef.current) return;

          const config: CIBeforeAfterConfig = {
            ...configProps,
            onSlide,
            onZoom,
            onFullscreenChange,
            onReady,
          };

          inst = new CIBeforeAfterCore(containerRef.current, config);
          instanceRef.current = inst;

          // Apply any config changes that arrived during async import
          if (pendingConfigRef.current) {
            inst.update(pendingConfigRef.current);
            pendingConfigRef.current = null;
          }
        },
        () => { /* dynamic import failed — component stays empty */ },
      );

      return () => {
        cancelled = true;
        inst?.destroy();
        instanceRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update on prop changes
    useEffect(() => {
      const config: Partial<CIBeforeAfterConfig> = {
        ...configProps,
        onSlide,
        onZoom,
        onFullscreenChange,
        onReady,
      };

      if (!instanceRef.current) {
        // Instance not yet initialized — store for later application
        pendingConfigRef.current = config;
        return;
      }

      instanceRef.current.update(config);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      configProps.beforeSrc,
      configProps.afterSrc,
      configProps.beforeAlt,
      configProps.afterAlt,
      configProps.mode,
      configProps.orientation,
      configProps.initialPosition,
      configProps.zoom,
      configProps.zoomMax,
      configProps.zoomMin,
      configProps.theme,
      configProps.handleStyle,
      configProps.labels,
      configProps.labelPosition,
      configProps.fullscreenButton,
      configProps.lazyLoad,
      configProps.zoomControls,
      configProps.zoomControlsPosition,
      configProps.scrollHint,
      configProps.keyboardStep,
      configProps.keyboardLargeStep,
      configProps.animate,
      configProps.animateOnce,
      configProps.cloudimage,
      onSlide,
      onZoom,
      onFullscreenChange,
      onReady,
    ]);

    return <div ref={containerRef} className={className} style={style} />;
  },
);
