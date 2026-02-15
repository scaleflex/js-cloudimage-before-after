import type {
  CIBeforeAfterConfig,
  CIBeforeAfterInstance,
  CIBeforeAfterElements,
  ResolvedConfig,
  SliderState,
} from './types';
import { resolveConfig } from './config';
import { createElement, resolveElement } from '../utils/dom';
import { EventManager } from '../utils/events';
import { buildCloudimageUrl } from '../utils/cloudimage';
import { updateClipPath, updateHandlePosition, clampPosition, type ClipZoomInfo } from '../slider/slider';
import { createHandle } from '../slider/handle';
import { SliderGestures } from '../slider/gestures';
import { ZoomPanController } from '../zoom/zoom-pan';
import { ZoomGestures } from '../zoom/gestures';
import { createZoomControls } from '../zoom/controls';
import { ScrollHint } from '../zoom/scroll-hint';
import { createLabels, updateLabelVisibility } from '../labels/labels';
import { FullscreenManager } from '../fullscreen/fullscreen';
import { EntranceAnimation } from '../animation/entrance';
import { KeyboardHandler } from '../a11y/keyboard';
import { updateAriaValue, setContainerAria } from '../a11y/aria';

export class CIBeforeAfterCore implements CIBeforeAfterInstance {
  private config: ResolvedConfig;
  private userConfig: CIBeforeAfterConfig;
  private state: SliderState;
  private elements!: CIBeforeAfterElements;
  private events = new EventManager();
  private imageEvents = new EventManager();
  private sliderGestures: SliderGestures | null = null;
  private zoomPan: ZoomPanController | null = null;
  private zoomGestures: ZoomGestures | null = null;
  private scrollHint: ScrollHint | null = null;
  private fullscreenManager: FullscreenManager | null = null;
  private entranceAnimation: EntranceAnimation | null = null;
  private keyboardHandler: KeyboardHandler | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private zoomControlsEl: HTMLElement | null = null;
  private zoomControlsEvents: import('../utils/events').EventManager | null = null;
  private lazyLoadObserver: IntersectionObserver | null = null;
  private resizeDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  private animTransitionTimer: ReturnType<typeof setTimeout> | null = null;
  private suppressCallbacks = false;

  constructor(
    target: HTMLElement | string,
    userConfig: CIBeforeAfterConfig,
  ) {
    const container = resolveElement(target);
    this.userConfig = { ...userConfig };
    this.config = resolveConfig(userConfig);

    this.state = {
      position: this.config.initialPosition,
      isDragging: false,
      zoomLevel: 1,
      panX: 0,
      panY: 0,
      isReady: false,
      isFullscreen: false,
    };

    this.buildDOM(container);
    this.initModules();
    this.loadImages();
  }

  // --- Public API ---

  getElements() {
    return {
      container: this.elements.container,
      viewport: this.elements.viewport,
      beforeImage: this.elements.beforeImage,
      afterImage: this.elements.afterImage,
      handle: this.elements.handle,
    };
  }

  setPosition(percent: number): void {
    const clamped = clampPosition(percent);
    this.updatePosition(clamped);
  }

  getPosition(): number {
    return this.state.position;
  }

  setZoom(level: number): void {
    this.zoomPan?.setZoom(level);
  }

  getZoom(): number {
    return this.zoomPan?.getZoom() ?? 1;
  }

  resetZoom(): void {
    this.zoomPan?.resetZoom();
  }

  enterFullscreen(): void {
    this.fullscreenManager?.enter().catch(() => {});
  }

  exitFullscreen(): void {
    this.fullscreenManager?.exit().catch(() => {});
  }

  isFullscreen(): boolean {
    return this.fullscreenManager?.getIsFullscreen() ?? false;
  }

  update(newConfig: Partial<CIBeforeAfterConfig>): void {
    // BUG-01: Merge over stored user config, not just beforeSrc/afterSrc
    this.userConfig = { ...this.userConfig, ...newConfig };
    const oldConfig = this.config;
    this.config = resolveConfig(this.userConfig);

    // Update images if src changed — reset loading state and re-register handlers
    const beforeSrcChanged = this.config.beforeSrc !== oldConfig.beforeSrc;
    const afterSrcChanged = this.config.afterSrc !== oldConfig.afterSrc;

    // Detect cloudimage config changes
    const cloudimageChanged = !shallowEqual(this.config.cloudimage, oldConfig.cloudimage);

    if (beforeSrcChanged || afterSrcChanged || cloudimageChanged) {
      // Disconnect stale lazy-load observer that captured old src values
      if (this.lazyLoadObserver) {
        this.lazyLoadObserver.disconnect();
        this.lazyLoadObserver = null;
      }

      // Reset loading state for new images
      this.state.isReady = false;
      this.elements.container.classList.add('ci-before-after-loading');

      if (beforeSrcChanged || cloudimageChanged) {
        this.elements.beforeImage.src = this.resolveImageSrc(this.config.beforeSrc);
      }
      if (afterSrcChanged || cloudimageChanged) {
        this.elements.afterImage.src = this.resolveImageSrc(this.config.afterSrc);
      }

      this.registerImageLoadHandlers(beforeSrcChanged || cloudimageChanged, afterSrcChanged || cloudimageChanged);

      // Toggle ResizeObserver for cloudimage
      if (this.config.cloudimage && !oldConfig.cloudimage) {
        this.initResizeObserver();
      } else if (!this.config.cloudimage && oldConfig.cloudimage) {
        this.resizeObserver?.disconnect();
        this.resizeObserver = null;
      }
    }

    // Update alt attributes
    if (this.config.beforeAlt !== oldConfig.beforeAlt) {
      this.elements.beforeImage.setAttribute('alt', this.config.beforeAlt);
    }
    if (this.config.afterAlt !== oldConfig.afterAlt) {
      this.elements.afterImage.setAttribute('alt', this.config.afterAlt);
    }

    // Update theme
    this.elements.container.classList.toggle('ci-before-after-theme-dark', this.config.theme === 'dark');

    // Update orientation classes
    this.elements.container.classList.toggle('ci-before-after-container--horizontal', this.config.orientation === 'horizontal');
    this.elements.container.classList.toggle('ci-before-after-container--vertical', this.config.orientation === 'vertical');

    // Update mode classes
    this.elements.container.classList.toggle('ci-before-after-container--hover-mode', this.config.mode === 'hover');
    this.elements.container.classList.toggle('ci-before-after-container--click-mode', this.config.mode === 'click');

    // Update zoom-related will-change class (QUAL-07)
    this.elements.viewport.classList.toggle('ci-before-after-viewport--zoomable', this.config.zoom);

    // Rebuild handle if style or orientation changed
    if (this.config.handleStyle !== oldConfig.handleStyle || this.config.orientation !== oldConfig.orientation) {
      this.rebuildHandle();
    }

    // Update slider gestures if mode or orientation changed (BUG-07)
    if (this.config.mode !== oldConfig.mode) {
      this.sliderGestures?.updateMode(this.config.mode);
    }
    if (this.config.orientation !== oldConfig.orientation) {
      this.sliderGestures?.updateOrientation(this.config.orientation);
    }

    // Update labels only when label config changed
    if (
      this.config.labelsEnabled !== oldConfig.labelsEnabled ||
      this.config.labelBefore !== oldConfig.labelBefore ||
      this.config.labelAfter !== oldConfig.labelAfter ||
      this.config.labelPosition !== oldConfig.labelPosition ||
      this.config.orientation !== oldConfig.orientation
    ) {
      this.rebuildLabels();
    }

    // Update zoom
    if (this.config.zoom !== oldConfig.zoom) {
      this.rebuildZoom();
    } else if (this.zoomPan) {
      this.zoomPan.updateConfig(this.config);

      // Handle scrollHint change independently of zoom toggle
      if (this.config.scrollHint !== oldConfig.scrollHint) {
        this.scrollHint?.destroy();
        this.scrollHint = null;
        if (this.config.scrollHint) {
          this.scrollHint = new ScrollHint(this.elements.container);
        }
      }

      // Handle zoomControls or zoomControlsPosition change
      if (
        this.config.zoomControls !== oldConfig.zoomControls ||
        this.config.zoomControlsPosition !== oldConfig.zoomControlsPosition
      ) {
        this.zoomControlsEvents?.destroy();
        this.zoomControlsEvents = null;
        this.zoomControlsEl?.remove();
        this.zoomControlsEl = null;
        this.elements.container.classList.remove('ci-before-after-container--zoom-top-right');
        this.elements.container.classList.remove('ci-before-after-container--zoom-top');
        this.elements.container.classList.remove('ci-before-after-container--zoom-left');

        if (this.config.zoomControls) {
          const controls = createZoomControls(
            this.config.zoomControlsPosition,
            {
              onZoomIn: () => this.zoomPan?.zoomIn(),
              onZoomOut: () => this.zoomPan?.zoomOut(),
              onReset: () => this.zoomPan?.resetZoom(),
            },
          );
          this.zoomControlsEl = controls.element;
          this.zoomControlsEvents = controls.events;
          this.elements.container.appendChild(this.zoomControlsEl);
          this.applyZoomPositionClasses();
        }
      }
    }

    // Update initial position
    if (this.config.initialPosition !== oldConfig.initialPosition) {
      this.updatePosition(this.config.initialPosition);
    }

    // Update fullscreen
    if (this.config.fullscreenButton !== oldConfig.fullscreenButton) {
      this.rebuildFullscreen();
    }

    // Update entrance animation
    if (this.config.animateEnabled !== oldConfig.animateEnabled) {
      this.entranceAnimation?.destroy();
      this.entranceAnimation = null;
      if (this.config.animateEnabled) {
        this.initEntranceAnimation();
      }
    }

    // Update keyboard handler
    this.keyboardHandler?.updateConfig(
      this.config.orientation,
      this.config.keyboardStep,
      this.config.keyboardLargeStep,
      this.config.zoom,
    );

    // Update position
    this.updatePosition(this.state.position);
  }

  destroy(): void {
    this.sliderGestures?.destroy();
    this.zoomGestures?.destroy();
    this.zoomPan?.destroy();
    this.zoomPan = null;
    this.scrollHint?.destroy();
    this.fullscreenManager?.destroy();
    this.entranceAnimation?.destroy();
    this.keyboardHandler?.destroy();
    this.events.destroy();
    this.imageEvents.destroy();
    this.resizeObserver?.disconnect();
    this.lazyLoadObserver?.disconnect();
    this.lazyLoadObserver = null;
    this.zoomControlsEvents?.destroy();
    this.zoomControlsEvents = null;
    this.zoomControlsEl?.remove();
    if (this.resizeDebounceTimer) clearTimeout(this.resizeDebounceTimer);
    if (this.animTransitionTimer) clearTimeout(this.animTransitionTimer);

    // SEC-03: Clear container instead of restoring unsanitized HTML
    this.elements.container.innerHTML = '';
    this.elements.container.removeAttribute('role');
    this.elements.container.removeAttribute('aria-label');
    this.elements.container.className = this.elements.container.className
      .split(' ')
      .filter((c) => !c.startsWith('ci-before-after'))
      .join(' ');
  }

  // --- Private Methods ---

  private buildDOM(container: HTMLElement): void {
    container.innerHTML = '';

    // Container setup
    const orientClass = `ci-before-after-container--${this.config.orientation}`;
    container.classList.add('ci-before-after-container', orientClass);

    if (this.config.mode === 'hover') container.classList.add('ci-before-after-container--hover-mode');
    if (this.config.mode === 'click') container.classList.add('ci-before-after-container--click-mode');
    if (this.config.theme === 'dark') container.classList.add('ci-before-after-theme-dark');

    container.classList.add('ci-before-after-loading');

    setContainerAria(container);

    // Viewport (receives zoom/pan transforms)
    const viewport = createElement('div', 'ci-before-after-viewport');
    // QUAL-07: Only set will-change when zoom is enabled
    if (this.config.zoom) viewport.classList.add('ci-before-after-viewport--zoomable');

    // Wrapper (contains images)
    const wrapper = createElement('div', 'ci-before-after-wrapper');

    // Before image (SPEC-01: add role="img")
    const beforeImage = createElement('img', 'ci-before-after-image ci-before-after-before', {
      alt: this.config.beforeAlt,
      draggable: 'false',
      role: 'img',
    });

    // Clip wrapper for after image
    const clip = createElement('div', 'ci-before-after-clip');
    updateClipPath(clip, this.state.position, this.config.orientation);

    // After image (SPEC-01: add role="img")
    const afterImage = createElement('img', 'ci-before-after-image ci-before-after-after', {
      alt: this.config.afterAlt,
      draggable: 'false',
      role: 'img',
    });

    clip.appendChild(afterImage);
    wrapper.append(beforeImage, clip);
    viewport.appendChild(wrapper);
    container.appendChild(viewport);

    // Handle (outside viewport for fixed positioning during zoom)
    const handle = createHandle(this.config.handleStyle, this.config.orientation, this.state.position);
    container.appendChild(handle);

    const handleGrip = handle.querySelector('.ci-before-after-handle-grip') as HTMLElement;

    // Labels
    let labelBefore: HTMLElement | null = null;
    let labelAfter: HTMLElement | null = null;

    if (this.config.labelsEnabled) {
      const labels = createLabels(
        this.config.labelBefore,
        this.config.labelAfter,
        this.config.labelPosition,
        this.config.orientation,
      );
      labelBefore = labels.before;
      labelAfter = labels.after;
      container.append(labelBefore, labelAfter);
    }

    this.elements = {
      container,
      viewport,
      wrapper,
      beforeImage,
      afterImage,
      clip,
      handle,
      handleGrip,
      labelBefore,
      labelAfter,
    };
  }

  private initModules(): void {
    // Slider gestures
    this.sliderGestures = new SliderGestures(
      this.elements.container,
      this.elements.handle,
      this.config.mode,
      this.config.orientation,
      {
        onPositionChange: (pos) => this.updatePosition(pos),
        onDragStart: () => this.onDragStart(),
        onDragEnd: () => this.onDragEnd(),
      },
    );

    // Keyboard navigation
    this.keyboardHandler = new KeyboardHandler(
      this.elements.handle,
      this.config.orientation,
      this.config.keyboardStep,
      this.config.keyboardLargeStep,
      this.config.zoom,
      {
        onPositionChange: (pos) => this.updatePosition(pos),
        getPosition: () => this.state.position,
        onZoomIn: () => this.zoomPan?.zoomIn(),
        onZoomOut: () => this.zoomPan?.zoomOut(),
        onZoomReset: () => this.zoomPan?.resetZoom(),
      },
    );

    // Zoom
    if (this.config.zoom) {
      this.initZoom();
    }

    // Fullscreen
    if (this.config.fullscreenButton) {
      this.elements.container.classList.add('ci-before-after-container--has-fullscreen');
      this.fullscreenManager = new FullscreenManager(
        this.elements.container,
        (isFullscreen) => {
          this.state.isFullscreen = isFullscreen;
          safeCall(this.config.onFullscreenChange, isFullscreen);
        },
      );
    }

    // Entrance animation
    if (this.config.animateEnabled) {
      this.initEntranceAnimation();
    }

    // ResizeObserver for cloudimage (QUAL-06: debounced)
    if (this.config.cloudimage) {
      this.initResizeObserver();
    }
  }

  private initZoom(): void {
    this.zoomPan = new ZoomPanController(
      this.elements.viewport,
      this.elements.container,
      this.config,
      (level) => {
        this.state.zoomLevel = level;
        this.syncClip();
        safeCall(this.config.onZoom, level);
      },
      () => this.syncClip(),
    );

    // Scroll hint
    if (this.config.scrollHint) {
      this.scrollHint = new ScrollHint(this.elements.container);
    }

    // Zoom gestures
    this.zoomGestures = new ZoomGestures(
      this.elements.container,
      this.elements.handle,
      this.zoomPan,
      () => this.scrollHint?.show(),
    );

    // Zoom controls
    if (this.config.zoomControls) {
      const controls = createZoomControls(
        this.config.zoomControlsPosition,
        {
          onZoomIn: () => this.zoomPan?.zoomIn(),
          onZoomOut: () => this.zoomPan?.zoomOut(),
          onReset: () => this.zoomPan?.resetZoom(),
        },
      );
      this.zoomControlsEl = controls.element;
      this.zoomControlsEvents = controls.events;
      this.elements.container.appendChild(this.zoomControlsEl);

      this.applyZoomPositionClasses();
    }
  }

  private applyZoomPositionClasses(): void {
    const pos = this.config.zoomControlsPosition;
    this.elements.container.classList.toggle('ci-before-after-container--zoom-top-right', pos === 'top-right');
    this.elements.container.classList.toggle('ci-before-after-container--zoom-top', pos.startsWith('top-'));
    this.elements.container.classList.toggle('ci-before-after-container--zoom-left', pos.endsWith('-left'));
  }

  private initEntranceAnimation(): void {
    // Clear any pending animation transition timer from a previous animation
    if (this.animTransitionTimer) {
      clearTimeout(this.animTransitionTimer);
      this.animTransitionTimer = null;
      this.elements.handle.style.transition = '';
      this.elements.clip.style.transition = '';
    }

    // Set initial position to edge for animation
    const startPosition = 0;
    this.suppressCallbacks = true;
    this.updatePosition(startPosition);
    this.suppressCallbacks = false;

    this.entranceAnimation = new EntranceAnimation(
      this.elements.container,
      this.config.animateDuration,
      this.config.animateDelay,
      this.config.animateEasing,
      this.config.animateOnce,
      (skipTransition: boolean) => {
        if (!skipTransition) {
          // Animate to initial position with CSS transitions
          this.elements.handle.style.transition =
            `left ${this.config.animateDuration}ms ${this.config.animateEasing}, top ${this.config.animateDuration}ms ${this.config.animateEasing}`;
          this.elements.clip.style.transition =
            `clip-path ${this.config.animateDuration}ms ${this.config.animateEasing}`;
        }

        this.updatePosition(this.config.initialPosition);

        if (!skipTransition) {
          this.animTransitionTimer = setTimeout(() => {
            this.animTransitionTimer = null;
            this.elements.handle.style.transition = '';
            this.elements.clip.style.transition = '';
          }, this.config.animateDuration);
        }
      },
    );
  }

  private loadImages(): void {
    const beforeSrc = this.resolveImageSrc(this.config.beforeSrc);
    const afterSrc = this.resolveImageSrc(this.config.afterSrc);

    if (this.config.lazyLoad && typeof IntersectionObserver !== 'undefined') {
      // BUG-06: Store observer for cleanup in destroy()
      this.lazyLoadObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              this.elements.beforeImage.src = beforeSrc;
              this.elements.afterImage.src = afterSrc;
              this.lazyLoadObserver?.disconnect();
              this.lazyLoadObserver = null;
            }
          }
        },
        { threshold: 0 },
      );
      this.lazyLoadObserver.observe(this.elements.container);
    } else {
      this.elements.beforeImage.src = beforeSrc;
      this.elements.afterImage.src = afterSrc;
    }

    this.registerImageLoadHandlers(true, true);
  }

  /**
   * Register load/error handlers for images. Cleans up previous handlers first.
   * When only one image changed, the unchanged image is treated as already loaded.
   */
  private registerImageLoadHandlers(beforeChanged: boolean, afterChanged: boolean): void {
    // Clean up previous image event handlers
    this.imageEvents.destroy();

    let beforeLoaded = !beforeChanged;
    let afterLoaded = !afterChanged;

    const checkReady = () => {
      if (beforeLoaded && afterLoaded) {
        this.onImagesReady();
      }
    };

    const onBeforeLoad = () => {
      if (!beforeLoaded) {
        beforeLoaded = true;
        checkReady();
      }
    };
    const onAfterLoad = () => {
      if (!afterLoaded) {
        afterLoaded = true;
        checkReady();
      }
    };

    const onBeforeError = () => {
      console.warn(`CIBeforeAfter: Failed to load image "${this.elements.beforeImage.src}"`);
      if (!beforeLoaded) {
        beforeLoaded = true;
        checkReady();
      }
    };
    const onAfterError = () => {
      console.warn(`CIBeforeAfter: Failed to load image "${this.elements.afterImage.src}"`);
      if (!afterLoaded) {
        afterLoaded = true;
        checkReady();
      }
    };

    this.imageEvents.on(this.elements.beforeImage, 'load', onBeforeLoad);
    this.imageEvents.on(this.elements.afterImage, 'load', onAfterLoad);
    this.imageEvents.on(this.elements.beforeImage, 'error', onBeforeError);
    this.imageEvents.on(this.elements.afterImage, 'error', onAfterError);

    // Handle already cached images
    if (this.elements.beforeImage.complete && this.elements.beforeImage.src) onBeforeLoad();
    if (this.elements.afterImage.complete && this.elements.afterImage.src) onAfterLoad();
  }

  private onImagesReady(): void {
    if (this.state.isReady) return;
    this.state.isReady = true;

    // Set aspect ratio from before image
    const { naturalWidth, naturalHeight } = this.elements.beforeImage;
    if (naturalWidth && naturalHeight) {
      this.elements.wrapper.style.aspectRatio = `${naturalWidth} / ${naturalHeight}`;
    }

    this.elements.container.classList.remove('ci-before-after-loading');
    safeCall(this.config.onReady);
  }

  private getClipZoomInfo(): ClipZoomInfo | undefined {
    if (!this.zoomPan || this.zoomPan.getZoom() <= 1) return undefined;
    const pan = this.zoomPan.getPan();
    const size = this.zoomPan.getContainerSize();
    return {
      level: this.zoomPan.getZoom(),
      panX: pan.x,
      panY: pan.y,
      containerWidth: size.width,
      containerHeight: size.height,
    };
  }

  private syncClip(): void {
    updateClipPath(this.elements.clip, this.state.position, this.config.orientation, this.getClipZoomInfo());
  }

  private updatePosition(position: number): void {
    this.state.position = clampPosition(position);
    updateClipPath(this.elements.clip, this.state.position, this.config.orientation, this.getClipZoomInfo());
    updateHandlePosition(this.elements.handle, this.state.position, this.config.orientation);
    updateAriaValue(this.elements.handle, this.state.position);
    updateLabelVisibility(
      this.elements.labelBefore,
      this.elements.labelAfter,
      this.state.position,
      this.config.orientation,
    );
    // BUG-10: Only fire callback when not suppressed (e.g. during init/animation setup)
    if (!this.suppressCallbacks) {
      safeCall(this.config.onSlide, this.state.position);
    }
  }

  private onDragStart(): void {
    this.state.isDragging = true;
    this.elements.container.classList.add('ci-before-after-container--dragging');
  }

  private onDragEnd(): void {
    this.state.isDragging = false;
    this.elements.container.classList.remove('ci-before-after-container--dragging');
  }

  private resolveImageSrc(src: string): string {
    if (this.config.cloudimage) {
      const width = this.elements.container.getBoundingClientRect().width || 800;
      return buildCloudimageUrl(src, width, this.config.cloudimage);
    }
    return src;
  }

  private rebuildHandle(): void {
    const hadFocus = document.activeElement === this.elements.handle;
    this.elements.handle.remove();
    const handle = createHandle(this.config.handleStyle, this.config.orientation, this.state.position);
    this.elements.container.appendChild(handle);
    this.elements.handle = handle;
    this.elements.handleGrip = handle.querySelector('.ci-before-after-handle-grip') as HTMLElement;

    // Rebind modules that depend on handle
    this.sliderGestures?.destroy();
    this.sliderGestures = new SliderGestures(
      this.elements.container,
      this.elements.handle,
      this.config.mode,
      this.config.orientation,
      {
        onPositionChange: (pos) => this.updatePosition(pos),
        onDragStart: () => this.onDragStart(),
        onDragEnd: () => this.onDragEnd(),
      },
    );

    this.keyboardHandler?.destroy();
    this.keyboardHandler = new KeyboardHandler(
      this.elements.handle,
      this.config.orientation,
      this.config.keyboardStep,
      this.config.keyboardLargeStep,
      this.config.zoom,
      {
        onPositionChange: (pos) => this.updatePosition(pos),
        getPosition: () => this.state.position,
        onZoomIn: () => this.zoomPan?.zoomIn(),
        onZoomOut: () => this.zoomPan?.zoomOut(),
        onZoomReset: () => this.zoomPan?.resetZoom(),
      },
    );

    if (this.zoomGestures && this.zoomPan) {
      this.zoomGestures.destroy();
      this.zoomGestures = new ZoomGestures(
        this.elements.container,
        this.elements.handle,
        this.zoomPan,
        () => this.scrollHint?.show(),
      );
    }

    // Restore keyboard focus if it was on the old handle
    if (hadFocus) {
      this.elements.handle.focus();
    }
  }

  private rebuildLabels(): void {
    this.elements.labelBefore?.remove();
    this.elements.labelAfter?.remove();
    this.elements.labelBefore = null;
    this.elements.labelAfter = null;

    if (this.config.labelsEnabled) {
      const labels = createLabels(
        this.config.labelBefore,
        this.config.labelAfter,
        this.config.labelPosition,
        this.config.orientation,
      );
      this.elements.labelBefore = labels.before;
      this.elements.labelAfter = labels.after;
      this.elements.container.append(labels.before, labels.after);
      updateLabelVisibility(labels.before, labels.after, this.state.position, this.config.orientation);
    }
  }

  private rebuildZoom(): void {
    this.zoomGestures?.destroy();
    this.zoomGestures = null;
    this.scrollHint?.destroy();
    this.scrollHint = null;
    this.zoomControlsEvents?.destroy();
    this.zoomControlsEvents = null;
    this.zoomControlsEl?.remove();
    this.zoomControlsEl = null;
    this.zoomPan?.destroy();
    this.zoomPan = null;
    this.elements.container.classList.remove('ci-before-after-container--zoom-top-right');
    this.elements.container.classList.remove('ci-before-after-container--zoom-top');
    this.elements.container.classList.remove('ci-before-after-container--zoom-left');

    if (this.config.zoom) {
      this.initZoom();
    }
  }

  private rebuildFullscreen(): void {
    this.fullscreenManager?.destroy();
    this.fullscreenManager = null;
    this.elements.container.classList.remove('ci-before-after-container--has-fullscreen');

    if (this.config.fullscreenButton) {
      this.elements.container.classList.add('ci-before-after-container--has-fullscreen');
      this.fullscreenManager = new FullscreenManager(
        this.elements.container,
        (isFullscreen) => {
          this.state.isFullscreen = isFullscreen;
          safeCall(this.config.onFullscreenChange, isFullscreen);
        },
      );
    }
  }

  private initResizeObserver(): void {
    if (typeof ResizeObserver === 'undefined') return;

    this.resizeObserver = new ResizeObserver(() => {
      // QUAL-06: Debounce cloudimage resize requests
      if (this.resizeDebounceTimer) clearTimeout(this.resizeDebounceTimer);
      this.resizeDebounceTimer = setTimeout(() => {
        if (this.config.cloudimage) {
          const newBeforeSrc = this.resolveImageSrc(this.config.beforeSrc);
          const newAfterSrc = this.resolveImageSrc(this.config.afterSrc);
          // Only set src when URL actually changed to avoid unnecessary network requests
          if (this.elements.beforeImage.src !== newBeforeSrc) {
            this.elements.beforeImage.src = newBeforeSrc;
          }
          if (this.elements.afterImage.src !== newAfterSrc) {
            this.elements.afterImage.src = newAfterSrc;
          }
        }
        this.resizeDebounceTimer = null;
      }, 200);
    });

    this.resizeObserver.observe(this.elements.container);
  }
}

function safeCall<T extends unknown[]>(fn: ((...args: T) => void) | undefined, ...args: T): void {
  if (!fn) return;
  try {
    fn(...args);
  } catch (err) {
    console.error('CIBeforeAfter: callback error:', err);
  }
}

function shallowEqual<T extends object>(a: T | undefined, b: T | undefined): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  const keysA = Object.keys(a) as (keyof T)[];
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (a[key] !== b[key]) return false;
  }
  return true;
}
