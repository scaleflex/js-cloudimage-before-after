import type { CIBeforeAfterConfig, CIBeforeAfterInstance } from '../core/types';
import type { CSSProperties } from 'react';

export interface CIBeforeAfterViewerProps extends Omit<CIBeforeAfterConfig, 'onSlide' | 'onZoom' | 'onFullscreenChange' | 'onReady'> {
  onSlide?: (position: number) => void;
  onZoom?: (level: number) => void;
  onFullscreenChange?: (isFullscreen: boolean) => void;
  onReady?: () => void;
  className?: string;
  style?: CSSProperties;
}

export type CIBeforeAfterViewerRef = CIBeforeAfterInstance;
