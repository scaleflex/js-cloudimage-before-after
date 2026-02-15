# js-cloudimage-before-after — Specification

> Interactive before/after image comparison slider with zoom, labels, and accessibility.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Core Features](#2-core-features)
3. [API Design](#3-api-design)
4. [Slider Configuration](#4-slider-configuration)
5. [Visual Design](#5-visual-design)
6. [Zoom & Pan](#6-zoom--pan)
7. [Label System](#7-label-system)
8. [React Wrapper API](#8-react-wrapper-api)
9. [Accessibility](#9-accessibility)
10. [Build & Distribution](#10-build--distribution)
11. [Project Structure](#11-project-structure)
12. [GitHub Pages Demo](#12-github-pages-demo)
13. [Additional Features](#13-additional-features)
14. [Competitor Feature Matrix](#14-competitor-feature-matrix)
15. [Roadmap](#15-roadmap)
16. [Appendices](#16-appendices)

---

## 1. Project Overview

### What

`js-cloudimage-before-after` is an open-source JavaScript library for creating interactive before/after image comparison sliders. Users drag, hover, or click a handle to reveal differences between two images — ideal for renovation showcases, photo retouching, product transformations, medical imaging, and any visual comparison workflow.

### Why

The existing ecosystem for before/after sliders has significant gaps:

- **No library combines zoom/pan with comparison** — users cannot inspect fine details
- **Most React-only or jQuery-based** — no modern vanilla JS option with React wrapper
- **No dual initialization** (JS API + HTML data-attributes) — most require JavaScript setup
- **TypeScript support** is inconsistent — few libraries ship full type definitions
- **Accessibility** is often an afterthought — proper `role="slider"` semantics, keyboard nav, and screen reader support are rare
- **Cloudimage/CDN integration** does not exist in any competitor
- **Entrance animations** are missing or require manual implementation
- **Theming** is limited to inline styles or proprietary config — no CSS variable approach

### Positioning

`js-cloudimage-before-after` fills these gaps by providing:

- A **zero-dependency**, TypeScript-first library
- **Combined zoom/pan + comparison** in a single package — unique in the market
- **Three interaction modes** — drag, hover, and click
- **Horizontal and vertical** orientations
- **Two equal initialization methods** — JavaScript API and HTML data-attributes
- **WCAG 2.1 AA** accessibility compliance out of the box
- **CSS variable theming** for easy customization
- A **React wrapper** with SSR support, Vue/Svelte wrappers planned
- **Fullscreen mode** via the browser Fullscreen API
- **Configurable entrance animation** triggered by `IntersectionObserver`
- **Modern build output** — ESM, CJS, and UMD in a single package
- **< 12 KB gzipped** bundle size

### Key Inspirations

- **TwentyTwenty** — the original jQuery before/after slider that popularized the pattern
- **img-comparison-slider** — the most-starred modern competitor (Web Component approach)
- **Scaleflex `js-cloudimage-hotspot`** — same build system pattern, React wrapper architecture, zoom/pan engine, deployment pipeline

---

## 2. Core Features

### v1.0 Feature Set

| Feature | Description |
|---|---|
| **Image Comparison** | Two-image reveal with `clip-path: inset()` for GPU-accelerated clipping |
| **Interaction Modes** | Drag (default), hover-to-reveal, click-to-set — configurable per instance |
| **Orientation** | Horizontal (left/right) and vertical (top/bottom) |
| **Handle** | Draggable divider with configurable style: `arrows`, `circle`, or `line` |
| **Labels** | Built-in "Before"/"After" labels with configurable text, position, and styling |
| **Zoom & Pan** | CSS transform-based, GPU-accelerated; both images zoom/pan in sync |
| **Fullscreen** | Browser Fullscreen API toggle button; auto-injected into container |
| **Entrance Animation** | Optional viewport-triggered reveal animation (handle slides to center) |
| **Accessibility** | WCAG 2.1 AA; `role="slider"` semantics; full keyboard navigation; ARIA attributes; reduced motion support |
| **Theming** | CSS variables as primary customization method; light (default) and dark themes |
| **Two Init Methods** | JavaScript API (`new CIBeforeAfter()`) and HTML data-attributes (`data-ci-before-after-*`) — fully equivalent |
| **React Wrapper** | Separate entry point with SSR support, hook API, ref-based instance access |
| **TypeScript** | Full type definitions, exported interfaces and types |
| **Cloudimage Integration** | Optional responsive image loading via Scaleflex Cloudimage CDN |
| **Build Formats** | ESM + CJS + UMD; single CDN file; `window.CIBeforeAfter` global |
| **Lazy Loading** | `IntersectionObserver`-based deferred image loading |

---

## 3. API Design

The library provides two fully equivalent initialization methods. Every configuration option available in the JavaScript API is also expressible via HTML data-attributes.

### 3.1 JavaScript API

```js
const instance = new CIBeforeAfter(element, config);
```

**Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `element` | `HTMLElement \| string` | Container element or CSS selector |
| `config` | `CIBeforeAfterConfig` | Configuration object |

**`CIBeforeAfterConfig` interface:**

```ts
interface CIBeforeAfterConfig {
  /** Before image source URL (required) */
  beforeSrc: string;

  /** After image source URL (required) */
  afterSrc: string;

  /** Alt text for the before image (default: 'Before') */
  beforeAlt?: string;

  /** Alt text for the after image (default: 'After') */
  afterAlt?: string;

  /** Interaction mode (default: 'drag') */
  mode?: 'drag' | 'hover' | 'click';

  /** Slider orientation (default: 'horizontal') */
  orientation?: 'horizontal' | 'vertical';

  /** Initial slider position as percentage 0–100 (default: 50) */
  initialPosition?: number;

  /** Enable zoom & pan — both images zoom/pan in sync (default: false) */
  zoom?: boolean;

  /** Maximum zoom level (default: 4) */
  zoomMax?: number;

  /** Minimum zoom level (default: 1) */
  zoomMin?: number;

  /** Theme — applies a preset of CSS variable values (default: 'light') */
  theme?: 'light' | 'dark';

  /** Handle visual style (default: 'arrows') */
  handleStyle?: 'arrows' | 'circle' | 'line';

  /** Show before/after labels (default: true) */
  labels?: boolean | { before?: string; after?: string };

  /** Position of labels (default: 'top') */
  labelPosition?: 'top' | 'bottom';

  /** Enable entrance animation when slider enters viewport (default: false) */
  animate?: boolean | {
    /** Animation duration in ms (default: 800) */
    duration?: number;
    /** Delay before animation starts in ms (default: 0) */
    delay?: number;
    /** CSS easing function (default: 'ease-out') */
    easing?: string;
  };

  /** Only play entrance animation once — subsequent viewport entries skip it (default: true) */
  animateOnce?: boolean;

  /** Show fullscreen toggle button (default: true) */
  fullscreenButton?: boolean;

  /** Enable lazy loading of both images (default: true) */
  lazyLoad?: boolean;

  /** Show zoom controls UI (default: true when zoom is enabled) */
  zoomControls?: boolean;

  /** Position of zoom controls (default: 'bottom-right') */
  zoomControlsPosition?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

  /** Show scroll hint when user scrolls without Ctrl/Cmd over zoomed container (default: true when zoom enabled) */
  scrollHint?: boolean;

  /** Step size for keyboard arrow navigation as percentage (default: 1) */
  keyboardStep?: number;

  /** Step size for Shift+arrow keyboard navigation as percentage (default: 10) */
  keyboardLargeStep?: number;

  /** Called when slider position changes */
  onSlide?: (position: number) => void;

  /** Called on zoom level change */
  onZoom?: (level: number) => void;

  /** Called when fullscreen state changes */
  onFullscreenChange?: (isFullscreen: boolean) => void;

  /** Called when both images have loaded and the slider is ready */
  onReady?: () => void;

  /** Optional Cloudimage integration for responsive image loading */
  cloudimage?: {
    /** Cloudimage customer token (e.g. 'demo'). Enables Cloudimage when set. */
    token: string;
    /** API version (default: 'v7') */
    apiVersion?: string;
    /** Custom Cloudimage domain (default: 'cloudimg.io') */
    domain?: string;
    /** Round requested width to nearest N pixels for better CDN caching (default: 100) */
    limitFactor?: number;
    /** Custom URL transformation params (e.g. 'q=80&org_if_sml=1') */
    params?: string;
    /** Supported device pixel ratios (default: [1, 1.5, 2]) */
    devicePixelRatioList?: number[];
  };
}
```

**Instance methods:**

```ts
interface CIBeforeAfterInstance {
  /** Get references to internal DOM elements */
  getElements(): {
    container: HTMLElement;
    viewport: HTMLElement;
    beforeImage: HTMLImageElement;
    afterImage: HTMLImageElement;
    handle: HTMLElement;
  };

  /** Set slider position programmatically (0–100) */
  setPosition(percent: number): void;

  /** Get current slider position (0–100) */
  getPosition(): number;

  /** Set zoom level programmatically */
  setZoom(level: number): void;

  /** Get current zoom level */
  getZoom(): number;

  /** Reset zoom and pan to initial state */
  resetZoom(): void;

  /** Enter browser fullscreen mode */
  enterFullscreen(): void;

  /** Exit browser fullscreen mode */
  exitFullscreen(): void;

  /** Check if currently in fullscreen mode */
  isFullscreen(): boolean;

  /** Update the entire configuration */
  update(config: Partial<CIBeforeAfterConfig>): void;

  /** Destroy the instance and clean up DOM/listeners */
  destroy(): void;
}
```

**Usage example:**

```js
import CIBeforeAfter from 'js-cloudimage-before-after';

const slider = new CIBeforeAfter('#renovation', {
  beforeSrc: 'https://example.com/kitchen-before.jpg',
  afterSrc: 'https://example.com/kitchen-after.jpg',
  beforeAlt: 'Kitchen before renovation',
  afterAlt: 'Kitchen after renovation',
  mode: 'drag',
  orientation: 'horizontal',
  initialPosition: 50,
  zoom: true,
  zoomMax: 4,
  labels: { before: 'Original', after: 'Renovated' },
  animate: { duration: 800, easing: 'ease-out' },
  onSlide(position) {
    console.log('Position:', position);
  },
});
```

### 3.2 HTML Data-Attribute Initialization

All configuration is expressed via `data-ci-before-after-*` attributes on the container element.

```html
<div
  data-ci-before-after-before-src="https://example.com/kitchen-before.jpg"
  data-ci-before-after-after-src="https://example.com/kitchen-after.jpg"
  data-ci-before-after-before-alt="Kitchen before renovation"
  data-ci-before-after-after-alt="Kitchen after renovation"
  data-ci-before-after-mode="drag"
  data-ci-before-after-orientation="horizontal"
  data-ci-before-after-initial-position="50"
  data-ci-before-after-zoom="true"
  data-ci-before-after-zoom-max="4"
  data-ci-before-after-theme="light"
  data-ci-before-after-handle-style="arrows"
  data-ci-before-after-labels="true"
  data-ci-before-after-label-before="Original"
  data-ci-before-after-label-after="Renovated"
  data-ci-before-after-label-position="top"
  data-ci-before-after-animate="true"
  data-ci-before-after-animate-duration="800"
  data-ci-before-after-fullscreen-button="true"
  data-ci-before-after-lazy-load="true"
></div>
```

**Auto-initialization (CDN usage):**

```html
<script src="https://cdn.scaleflex.it/plugins/js-cloudimage-before-after/1.0.0/js-cloudimage-before-after.min.js"></script>
<script>CIBeforeAfter.autoInit();</script>
```

`CIBeforeAfter.autoInit()` scans the DOM for all elements with `data-ci-before-after-before-src` and initializes each one. It returns an array of `CIBeforeAfterInstance` objects.

```ts
CIBeforeAfter.autoInit(root?: HTMLElement): CIBeforeAfterInstance[];
```

**Attribute mapping:**

| HTML Attribute | Config Property | Type |
|---|---|---|
| `data-ci-before-after-before-src` | `beforeSrc` | `string` |
| `data-ci-before-after-after-src` | `afterSrc` | `string` |
| `data-ci-before-after-before-alt` | `beforeAlt` | `string` |
| `data-ci-before-after-after-alt` | `afterAlt` | `string` |
| `data-ci-before-after-mode` | `mode` | `'drag' \| 'hover' \| 'click'` |
| `data-ci-before-after-orientation` | `orientation` | `'horizontal' \| 'vertical'` |
| `data-ci-before-after-initial-position` | `initialPosition` | `string -> number` |
| `data-ci-before-after-zoom` | `zoom` | `'true' \| 'false'` |
| `data-ci-before-after-zoom-max` | `zoomMax` | `string -> number` |
| `data-ci-before-after-zoom-min` | `zoomMin` | `string -> number` |
| `data-ci-before-after-theme` | `theme` | `'light' \| 'dark'` |
| `data-ci-before-after-handle-style` | `handleStyle` | `'arrows' \| 'circle' \| 'line'` |
| `data-ci-before-after-labels` | `labels` | `'true' \| 'false'` |
| `data-ci-before-after-label-before` | `labels.before` | `string` |
| `data-ci-before-after-label-after` | `labels.after` | `string` |
| `data-ci-before-after-label-position` | `labelPosition` | `'top' \| 'bottom'` |
| `data-ci-before-after-animate` | `animate` | `'true' \| 'false'` |
| `data-ci-before-after-animate-duration` | `animate.duration` | `string -> number` |
| `data-ci-before-after-animate-delay` | `animate.delay` | `string -> number` |
| `data-ci-before-after-animate-easing` | `animate.easing` | `string` |
| `data-ci-before-after-animate-once` | `animateOnce` | `'true' \| 'false'` |
| `data-ci-before-after-fullscreen-button` | `fullscreenButton` | `'true' \| 'false'` |
| `data-ci-before-after-lazy-load` | `lazyLoad` | `'true' \| 'false'` |
| `data-ci-before-after-zoom-controls` | `zoomControls` | `'true' \| 'false'` |
| `data-ci-before-after-zoom-controls-position` | `zoomControlsPosition` | positional string |
| `data-ci-before-after-scroll-hint` | `scrollHint` | `'true' \| 'false'` |
| `data-ci-before-after-keyboard-step` | `keyboardStep` | `string -> number` |
| `data-ci-before-after-keyboard-large-step` | `keyboardLargeStep` | `string -> number` |
| `data-ci-before-after-ci-token` | `cloudimage.token` | `string` |
| `data-ci-before-after-ci-api-version` | `cloudimage.apiVersion` | `string` |
| `data-ci-before-after-ci-domain` | `cloudimage.domain` | `string` |
| `data-ci-before-after-ci-limit-factor` | `cloudimage.limitFactor` | `string -> number` |
| `data-ci-before-after-ci-params` | `cloudimage.params` | `string` |

> **Note:** Callback options (`onSlide`, `onZoom`, `onFullscreenChange`, `onReady`) are only available via the JavaScript API, as functions cannot be expressed as HTML attributes. To attach callbacks to HTML-initialized instances, retrieve the instance from `autoInit()` return value and call methods on it.

---

## 4. Slider Configuration

### 4.1 Position System

The slider position is expressed as a percentage from `0` to `100`:

- **`0`** — handle at the start (left edge for horizontal, top edge for vertical); after image fully revealed
- **`100`** — handle at the end (right edge for horizontal, bottom edge for vertical); before image fully revealed
- **`50`** (default) — handle centered; equal split

The position value maps directly to the `clip-path: inset()` value applied to the after image's wrapper:

**Horizontal mode:**

```css
/* Horizontal: position = 50 → show after image from 50% to 100% */
.ci-before-after-clip {
  clip-path: inset(0 0 0 50%);  /* clip left 50% of after image */
}
```

**Vertical mode:**

```css
/* Vertical: position = 50 → show after image from 50% downward */
.ci-before-after-clip {
  clip-path: inset(50% 0 0 0);  /* clip top 50% of after image */
}
```

The handle element is positioned using `left: 50%` (horizontal) or `top: 50%` (vertical) via CSS custom property `--ci-before-after-position`.

### 4.2 Internal State

```ts
interface SliderState {
  /** Current position 0–100 */
  position: number;
  /** Whether the user is actively dragging */
  isDragging: boolean;
  /** Current zoom level */
  zoomLevel: number;
  /** Current pan offset */
  panX: number;
  panY: number;
  /** Whether entrance animation has played */
  hasAnimated: boolean;
  /** Whether both images have loaded */
  isReady: boolean;
  /** Whether currently in fullscreen */
  isFullscreen: boolean;
}
```

---

## 5. Visual Design

### 5.1 DOM Structure

```html
<div class="ci-before-after-container" role="group" aria-label="Image comparison">
  <div class="ci-before-after-viewport">
    <div class="ci-before-after-wrapper">
      <img class="ci-before-after-image ci-before-after-before" src="before.jpg" alt="Before" />
      <div class="ci-before-after-clip">
        <img class="ci-before-after-image ci-before-after-after" src="after.jpg" alt="After" />
      </div>
    </div>
  </div>
  <div class="ci-before-after-handle" role="slider" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" aria-label="Image comparison slider" aria-orientation="horizontal" tabindex="0">
    <div class="ci-before-after-handle-line"></div>
    <div class="ci-before-after-handle-grip">
      <!-- Arrows or circle icon SVG -->
    </div>
    <div class="ci-before-after-handle-line"></div>
  </div>
  <div class="ci-before-after-label ci-before-after-label-before" aria-hidden="true">Before</div>
  <div class="ci-before-after-label ci-before-after-label-after" aria-hidden="true">After</div>
  <!-- Zoom controls (when zoom enabled) -->
  <!-- Fullscreen button -->
</div>
```

The before image is the base layer at full size. The after image sits on top inside `.ci-before-after-clip`, which uses `clip-path: inset()` to reveal only the portion past the handle. Both images are `position: absolute` and fill the wrapper. The wrapper sizing is determined by the before image's natural aspect ratio.

### 5.2 CSS Variables (Primary Theming Mechanism)

All visual customization is done via CSS custom properties. Consumers override values by setting CSS variables on the container or any ancestor element.

```css
/* === Handle === */
--ci-before-after-handle-width: 4px;
--ci-before-after-handle-color: #ffffff;
--ci-before-after-handle-shadow: 0 0 8px rgba(0, 0, 0, 0.3);

/* === Handle Grip (draggable button) === */
--ci-before-after-grip-size: 44px;
--ci-before-after-grip-bg: #ffffff;
--ci-before-after-grip-border: 2px solid rgba(0, 0, 0, 0.1);
--ci-before-after-grip-border-radius: 50%;
--ci-before-after-grip-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
--ci-before-after-grip-icon-color: #333333;
--ci-before-after-grip-icon-size: 20px;

/* === Handle Hover/Active States === */
--ci-before-after-grip-hover-bg: #f0f0f0;
--ci-before-after-grip-hover-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
--ci-before-after-grip-active-bg: #e0e0e0;
--ci-before-after-grip-active-scale: 0.95;

/* === Labels === */
--ci-before-after-label-font-family: inherit;
--ci-before-after-label-font-size: 14px;
--ci-before-after-label-font-weight: 600;
--ci-before-after-label-color: #ffffff;
--ci-before-after-label-bg: rgba(0, 0, 0, 0.5);
--ci-before-after-label-padding: 6px 14px;
--ci-before-after-label-border-radius: 6px;
--ci-before-after-label-offset-x: 12px;
--ci-before-after-label-offset-y: 12px;
--ci-before-after-label-backdrop-filter: blur(4px);

/* === Container === */
--ci-before-after-border-radius: 0px;
--ci-before-after-shadow: none;

/* === Transitions === */
--ci-before-after-handle-transition: 150ms ease;
--ci-before-after-slide-transition: 0ms;

/* === Entrance Animation === */
--ci-before-after-animate-duration: 800ms;
--ci-before-after-animate-easing: ease-out;

/* === Zoom Controls === */
--ci-before-after-zoom-controls-bg: rgba(255, 255, 255, 0.9);
--ci-before-after-zoom-controls-color: #333333;
--ci-before-after-zoom-controls-border-radius: 8px;
--ci-before-after-zoom-controls-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
```

**Custom theming example:**

```css
/* Dark editorial style */
.my-comparison {
  --ci-before-after-handle-color: #e0c97f;
  --ci-before-after-grip-bg: #1a1a1a;
  --ci-before-after-grip-icon-color: #e0c97f;
  --ci-before-after-grip-border: 2px solid #e0c97f;
  --ci-before-after-label-bg: rgba(26, 26, 26, 0.8);
  --ci-before-after-label-color: #e0c97f;
  --ci-before-after-border-radius: 12px;
}
```

### 5.3 Light & Dark Themes

Themes are implemented as sets of CSS variable overrides. Setting `theme: 'dark'` (or `data-ci-before-after-theme="dark"`) applies the `ci-before-after-theme-dark` class to the container.

**Dark theme overrides:**

```css
.ci-before-after-theme-dark {
  --ci-before-after-handle-color: #e0e0e0;
  --ci-before-after-handle-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
  --ci-before-after-grip-bg: #1a1a1a;
  --ci-before-after-grip-border: 2px solid rgba(255, 255, 255, 0.2);
  --ci-before-after-grip-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  --ci-before-after-grip-icon-color: #f0f0f0;
  --ci-before-after-grip-hover-bg: #2a2a2a;
  --ci-before-after-grip-active-bg: #333333;
  --ci-before-after-label-bg: rgba(255, 255, 255, 0.15);
  --ci-before-after-label-color: #f0f0f0;
  --ci-before-after-zoom-controls-bg: rgba(30, 30, 30, 0.9);
  --ci-before-after-zoom-controls-color: #f0f0f0;
}
```

### 5.4 Handle Styles

Three built-in handle styles, selectable via `handleStyle`:

**`'arrows'` (default):**
A circular grip with left/right arrows (horizontal) or up/down arrows (vertical). Uses Lucide `ChevronLeft`/`ChevronRight` or `ChevronUp`/`ChevronDown` SVG icons. Two lines extend from the grip to the container edges.

**`'circle'`:**
A circular grip with a double-headed arrow icon (Lucide `MoveHorizontal` or `MoveVertical`). No extending lines — just the circle.

**`'line'`:**
A simple divider line with a small pill-shaped grab indicator at the center. Minimal aesthetic.

### 5.5 Handle States

**Hover state:** Grip scales up slightly (`scale(1.1)`) with enhanced shadow. Cursor changes to `ew-resize` (horizontal) or `ns-resize` (vertical).

**Active/dragging state:** Grip scales down slightly (`scale(0.95)`) with background color change. A subtle glow effect on the line.

**Focus state:** Visible focus ring when focused via keyboard (`:focus-visible`), styled with `outline` for visibility against any background.

### 5.6 Reduced Motion

All animations respect the `prefers-reduced-motion` media query:

```css
@media (prefers-reduced-motion: reduce) {
  .ci-before-after-container,
  .ci-before-after-container * {
    animation: none !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 6. Zoom & Pan

### 6.1 Implementation

Zoom and pan use CSS transforms on the viewport element, identical to the hotspot project. **Both images zoom and pan in sync** — the clip-path boundary and handle position remain fixed relative to the container while the image content zooms underneath.

```
<div class="ci-before-after-container">          <- outer (overflow: hidden)
  <div class="ci-before-after-viewport">         <- receives transform: scale() translate()
    <div class="ci-before-after-wrapper">
      <img class="ci-before-after-before" />      <- base layer
      <div class="ci-before-after-clip">           <- clip-path applied here
        <img class="ci-before-after-after" />
      </div>
    </div>
  </div>
  <div class="ci-before-after-handle" />          <- NOT inside viewport (stays fixed)
  <div class="ci-before-after-label-before" />    <- NOT inside viewport
  <div class="ci-before-after-label-after" />     <- NOT inside viewport
</div>
```

The viewport element receives:

```css
.ci-before-after-viewport {
  transform: scale(var(--zoom)) translate(var(--pan-x), var(--pan-y));
  transform-origin: 0 0;
  will-change: transform;
}
```

**Key behavior:** The handle, labels, zoom controls, and fullscreen button are **outside** the viewport element, so they maintain their position and size during zoom. Only the image content zooms.

### 6.2 Input Methods

| Input | Behavior |
|---|---|
| **Mouse wheel** | Zoom in/out centered on cursor position (requires Ctrl/Cmd modifier key) |
| **Pinch gesture** | Zoom in/out centered between two touch points |
| **Double-click / Double-tap** | Toggle between 1x and 2x zoom (blocked on handle to prevent accidental zoom) |
| **Click-drag (non-handle area)** | Pan when zoomed in (zoom level > 1) |
| **Zoom controls UI** | `+` and `-` buttons, reset button |
| **Programmatic** | `instance.setZoom(level)`, `instance.resetZoom()` |

### 6.3 Zoom Constraints

- **Min zoom:** 1 (default) — configurable via `zoomMin`
- **Max zoom:** 4 (default) — configurable via `zoomMax`
- **Pan boundaries:** The images cannot be panned beyond their edges
- **Smooth transitions:** Zoom level changes animate with `transition: transform 300ms ease`

### 6.4 Interaction Priority During Zoom

When zoomed in, there is potential conflict between drag-to-pan and drag-to-slide. The resolution:

- **Handle drag** always controls slider position, regardless of zoom level
- **Non-handle drag** pans the image when zoom > 1
- **Non-handle drag** has no effect when zoom = 1 (image is not zoomable)
- **Hover mode** continues to work when zoomed — the mouse position maps to the visible portion
- **Click mode** continues to work when zoomed — click position on the visible area sets the slider

### 6.5 Scroll / Wheel Gating & Scroll Hint

Same implementation as hotspot:

- **Regular scroll** (no modifier key): passes through to the page
- **Ctrl+scroll** (or **Cmd+scroll** on Mac): triggers zoom
- **Safari trackpad pinch**: handled via `GestureEvent` API

When a user scrolls without the modifier key over a zoom-enabled container, a **scroll hint toast** appears:

- Text: "Ctrl + scroll or pinch to zoom"
- Auto-hides after 1.5 seconds
- `aria-hidden="true"`
- Disable with `scrollHint: false`

### 6.6 Zoom Controls UI

Same as hotspot. When `zoomControls` is enabled (default when `zoom: true`), a floating control bar appears. Position is configurable via `zoomControlsPosition` (default: `'bottom-right'`).

Buttons: zoom in (`+`), zoom out (`-`), reset (`R`). Styled via `--ci-before-after-zoom-controls-*` CSS variables. Uses Lucide SVG icons.

When zoom controls are positioned at `top-right`, the fullscreen button is automatically offset to avoid overlap.

### 6.7 Fullscreen Mode

When `fullscreenButton` is enabled (default: `true`), a toggle button appears at the top-right corner of the container. It uses the browser's Fullscreen API with webkit prefixed fallbacks for Safari.

- **Enter fullscreen:** Container expands to fill the viewport with a black background; images use `object-fit: contain` and `max-height: 100vh`
- **Exit fullscreen:** Returns to normal layout
- **Icons:** Lucide `Maximize2` (enter) / `Minimize2` (exit) SVG icons
- **ARIA:** `aria-label="Enter fullscreen"` / `"Exit fullscreen"`, `aria-pressed` tracks state
- **Programmatic:** `instance.enterFullscreen()`, `instance.exitFullscreen()`, `instance.isFullscreen()`
- **Callback:** `onFullscreenChange(isFullscreen)` fires when state changes
- **Graceful degradation:** If the Fullscreen API is not supported, the button is not rendered

---

## 7. Label System

### 7.1 Built-in Labels

By default, "Before" and "After" labels appear on their respective sides of the slider. Labels are positioned based on `labelPosition`:

**`'top'` (default):**
- Before label: top-left of the before region
- After label: top-right of the after region

**`'bottom'`:**
- Before label: bottom-left of the before region
- After label: bottom-right of the after region

For vertical orientation, labels swap accordingly:
- `'top'`: Before label at top-left, After label at bottom-left
- `'bottom'`: Before label at top-right, After label at bottom-right

### 7.2 Label Configuration

```js
// Default labels
{ labels: true }                            // "Before" / "After"

// Custom text
{ labels: { before: 'Original', after: 'Edited' } }

// Disabled
{ labels: false }
```

Via data attributes:

```html
data-ci-before-after-labels="true"
data-ci-before-after-label-before="Original"
data-ci-before-after-label-after="Edited"
```

### 7.3 Label Visibility During Interaction

Labels fade out when the slider handle is near them (within 15% of their edge) to avoid overlap with the handle. They fade back in when the handle moves away. This uses a CSS opacity transition.

### 7.4 Label DOM Structure

```html
<div class="ci-before-after-label ci-before-after-label-before" aria-hidden="true">
  Before
</div>
<div class="ci-before-after-label ci-before-after-label-after" aria-hidden="true">
  After
</div>
```

Labels are `aria-hidden="true"` because the `aria-label` on the container and handle already conveys the before/after semantics to screen readers.

---

## 8. React Wrapper API

### 8.1 Entry Point

```ts
import { CIBeforeAfterViewer, useCIBeforeAfter } from 'js-cloudimage-before-after/react';
```

The React wrapper is a **separate entry point** to avoid bundling React for vanilla JS consumers. React is an **optional peer dependency**.

### 8.2 `<CIBeforeAfterViewer>` Component

```tsx
interface CIBeforeAfterViewerProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
  mode?: 'drag' | 'hover' | 'click';
  orientation?: 'horizontal' | 'vertical';
  initialPosition?: number;
  zoom?: boolean;
  zoomMax?: number;
  zoomMin?: number;
  theme?: 'light' | 'dark';
  handleStyle?: 'arrows' | 'circle' | 'line';
  labels?: boolean | { before?: string; after?: string };
  labelPosition?: 'top' | 'bottom';
  animate?: boolean | { duration?: number; delay?: number; easing?: string };
  animateOnce?: boolean;
  fullscreenButton?: boolean;
  lazyLoad?: boolean;
  zoomControls?: boolean;
  zoomControlsPosition?: CIBeforeAfterConfig['zoomControlsPosition'];
  scrollHint?: boolean;
  keyboardStep?: number;
  keyboardLargeStep?: number;
  cloudimage?: CIBeforeAfterConfig['cloudimage'];
  onSlide?: (position: number) => void;
  onZoom?: (level: number) => void;
  onFullscreenChange?: (isFullscreen: boolean) => void;
  onReady?: () => void;
  className?: string;
  style?: React.CSSProperties;
}
```

**Usage example:**

```tsx
import { CIBeforeAfterViewer } from 'js-cloudimage-before-after/react';

function RenovationShowcase() {
  return (
    <CIBeforeAfterViewer
      beforeSrc="/kitchen-before.jpg"
      afterSrc="/kitchen-after.jpg"
      beforeAlt="Kitchen before renovation"
      afterAlt="Kitchen after renovation"
      zoom
      zoomMax={4}
      labels={{ before: 'Original', after: 'Renovated' }}
      animate={{ duration: 800 }}
      onSlide={(pos) => console.log('Position:', pos)}
    />
  );
}
```

### 8.3 `useCIBeforeAfter` Hook

Provides direct access to the vanilla `CIBeforeAfterInstance` for imperative control:

```tsx
import { useCIBeforeAfter } from 'js-cloudimage-before-after/react';

function RenovationShowcase() {
  const { containerRef, instance } = useCIBeforeAfter({
    beforeSrc: '/kitchen-before.jpg',
    afterSrc: '/kitchen-after.jpg',
    zoom: true,
  });

  return (
    <>
      <div ref={containerRef} />
      <button onClick={() => instance.current?.setPosition(0)}>Show After</button>
      <button onClick={() => instance.current?.setPosition(100)}>Show Before</button>
      <button onClick={() => instance.current?.setZoom(2)}>Zoom 2x</button>
    </>
  );
}
```

### 8.4 Ref API

The `<CIBeforeAfterViewer>` component forwards a ref exposing instance methods:

```tsx
import { useRef } from 'react';
import { CIBeforeAfterViewer, CIBeforeAfterViewerRef } from 'js-cloudimage-before-after/react';

function RenovationShowcase() {
  const viewerRef = useRef<CIBeforeAfterViewerRef>(null);

  return (
    <>
      <CIBeforeAfterViewer
        ref={viewerRef}
        beforeSrc="/kitchen-before.jpg"
        afterSrc="/kitchen-after.jpg"
        zoom
      />
      <button onClick={() => viewerRef.current?.setPosition(25)}>25%</button>
      <button onClick={() => viewerRef.current?.setZoom(3)}>Zoom 3x</button>
      <button onClick={() => viewerRef.current?.enterFullscreen()}>Fullscreen</button>
    </>
  );
}
```

### 8.5 SSR Safety

The React wrapper is SSR-safe:

- The vanilla core is instantiated inside `useEffect` (client-only)
- No `window`, `document`, or `navigator` access during server rendering
- The component renders an empty container `<div>` on the server; hydration attaches the slider

---

## 9. Accessibility

### 9.1 WCAG 2.1 AA Compliance

The library targets WCAG 2.1 Level AA conformance across all interactive elements.

### 9.2 Keyboard Navigation

| Key | Action |
|---|---|
| `Tab` | Focus the slider handle |
| `Arrow Left` / `Arrow Right` | Move slider by `keyboardStep` (default: 1%) in horizontal mode |
| `Arrow Up` / `Arrow Down` | Move slider by `keyboardStep` (default: 1%) in vertical mode |
| `Shift + Arrow` | Move slider by `keyboardLargeStep` (default: 10%) |
| `Home` | Move slider to 0% (fully reveal after image) |
| `End` | Move slider to 100% (fully reveal before image) |
| `+` / `=` | Zoom in (when zoom enabled) |
| `-` | Zoom out (when zoom enabled) |
| `0` | Reset zoom (when zoom enabled) |

### 9.3 ARIA Attributes

**Handle element:**

```html
<div
  class="ci-before-after-handle"
  role="slider"
  aria-valuenow="50"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-label="Image comparison slider. Use arrow keys to adjust the before and after split position."
  aria-orientation="horizontal"
  tabindex="0"
>
```

When the slider position changes:
- `aria-valuenow` is updated to the current position (0–100)

**Container element:**

```html
<div
  class="ci-before-after-container"
  role="group"
  aria-label="Before and after image comparison"
>
```

**Images:**

```html
<img class="ci-before-after-before" alt="{beforeAlt}" role="img" />
<img class="ci-before-after-after" alt="{afterAlt}" role="img" />
```

### 9.4 Focus Management

- **Focus ring:** The handle displays a visible focus ring when focused via keyboard (`:focus-visible`)
- **Focus on init:** The handle does not auto-focus on initialization (avoids unexpected scroll)
- **Fullscreen button:** Keyboard-accessible with `aria-label` and `aria-pressed`
- **Zoom controls:** Keyboard-accessible buttons with `aria-label`

### 9.5 Screen Reader Support

- The handle uses `role="slider"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` — screen readers announce position changes as percentage values
- `aria-label` on the handle explains the interaction
- `aria-orientation` communicates horizontal vs vertical
- Labels are `aria-hidden="true"` since the handle's ARIA attributes already convey semantics
- The container uses `role="group"` with `aria-label` to announce the comparison context

### 9.6 Reduced Motion

All animations and transitions respect the `prefers-reduced-motion: reduce` media query (see [Section 5.6](#56-reduced-motion)):

- Entrance animation is skipped
- Handle transitions are instant
- Zoom transitions are instant
- Label fade transitions are instant

---

## 10. Build & Distribution

### 10.1 Build Tool

**Vite** is used as the build tool, following the pattern established by `js-cloudimage-hotspot`.

### 10.2 Output Formats

| Format | File | Use Case |
|---|---|---|
| **ESM** | `dist/js-cloudimage-before-after.esm.js` | Modern bundlers (Webpack, Vite, Rollup) |
| **CJS** | `dist/js-cloudimage-before-after.cjs.js` | Node.js, legacy bundlers |
| **UMD** | `dist/js-cloudimage-before-after.min.js` | CDN `<script>` tag, exposes `window.CIBeforeAfter` |
| **TypeScript** | `dist/index.d.ts` | Type definitions |
| **React ESM** | `dist/react/index.js` | React wrapper (ESM) |
| **React CJS** | `dist/react/index.cjs` | React wrapper (CJS) |
| **React Types** | `dist/react/index.d.ts` | React wrapper type definitions |

### 10.3 `package.json` Configuration

```json
{
  "name": "js-cloudimage-before-after",
  "version": "1.0.0",
  "description": "Interactive before/after image comparison slider with zoom, labels, and accessibility",
  "license": "MIT",
  "author": "Scaleflex",
  "main": "dist/js-cloudimage-before-after.cjs.js",
  "module": "dist/js-cloudimage-before-after.esm.js",
  "unpkg": "dist/js-cloudimage-before-after.min.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/js-cloudimage-before-after.esm.js",
      "require": "./dist/js-cloudimage-before-after.cjs.js"
    },
    "./react": {
      "types": "./dist/react/index.d.ts",
      "import": "./dist/react/index.js",
      "require": "./dist/react/index.cjs"
    }
  },
  "files": [
    "dist"
  ],
  "peerDependencies": {
    "react": ">=17.0.0",
    "react-dom": ">=17.0.0"
  },
  "peerDependenciesMeta": {
    "react": { "optional": true },
    "react-dom": { "optional": true }
  },
  "sideEffects": false
}
```

### 10.4 npm Scripts

| Script | Description |
|---|---|
| `dev` | Start Vite dev server with demo page |
| `dev:react` | Start Vite dev server with React demo |
| `build` | Build all formats (main bundle + React wrapper + type declarations) |
| `build:bundle` | Build main bundle only (ESM + CJS + UMD) |
| `build:react` | Build React wrapper only |
| `build:demo` | Build GitHub Pages demo site |
| `typecheck` | Run TypeScript type checking |
| `typecheck:emit` | Emit type declarations to `dist/` |
| `test` | Run tests with Vitest |
| `test:watch` | Run tests in watch mode |
| `test:coverage` | Run tests with coverage report |
| `lint` | Run ESLint |

### 10.5 Bundle Size Targets

| Bundle | Target |
|---|---|
| Core (UMD, minified + gzipped) | < 12 KB |
| Core (ESM, minified + gzipped) | < 10 KB |
| React wrapper (ESM, minified + gzipped) | < 2 KB |

### 10.6 CDN

The UMD bundle will be available via Scaleflex CDN:

```
https://scaleflex.cloudimg.io/v7/plugins/js-cloudimage-before-after/1.0.0/js-cloudimage-before-after.min.js
```

### 10.7 Zero Runtime Dependencies

The library has **zero runtime dependencies**. All functionality — slider mechanics, clip-path management, zoom/pan, animations, fullscreen — is implemented within the library itself.

---

## 11. Project Structure

```
js-cloudimage-before-after/
├── src/
│   ├── index.ts                    # Main entry — CIBeforeAfter class + autoInit
│   ├── core/
│   │   ├── ci-before-after.ts      # Core class implementation
│   │   ├── config.ts               # Config parsing, defaults, data-attr mapping
│   │   └── types.ts                # TypeScript interfaces and types
│   ├── slider/
│   │   ├── slider.ts               # Slider position logic, clip-path management
│   │   ├── handle.ts               # Handle element creation and styling
│   │   └── gestures.ts             # Drag, touch, hover, click input handlers
│   ├── zoom/
│   │   ├── zoom-pan.ts             # Zoom and pan controller
│   │   ├── controls.ts             # Zoom controls UI
│   │   ├── gestures.ts             # Touch gesture handling (pinch, drag)
│   │   └── scroll-hint.ts          # Scroll-to-zoom hint toast UI
│   ├── labels/
│   │   └── labels.ts               # Label creation, positioning, fade logic
│   ├── fullscreen/
│   │   └── fullscreen.ts           # Fullscreen API wrapper and toggle button
│   ├── animation/
│   │   └── entrance.ts             # IntersectionObserver entrance animation
│   ├── a11y/
│   │   ├── keyboard.ts             # Keyboard navigation handler
│   │   └── aria.ts                 # ARIA attribute management
│   ├── utils/
│   │   ├── dom.ts                  # DOM utilities
│   │   ├── cloudimage.ts           # Cloudimage URL builder and responsive sizing
│   │   └── events.ts               # Event listener helpers
│   ├── styles/
│   │   └── index.css               # All styles (injected at runtime or importable)
│   └── react/
│       ├── index.ts                # React entry point
│       ├── ci-before-after-viewer.tsx  # React component
│       ├── use-ci-before-after.ts  # React hook
│       └── types.ts                # React-specific types
├── demo/
│   ├── index.html                  # Vanilla JS demo page (GitHub Pages)
│   ├── demo.css                    # Demo-specific layout styles
│   ├── demo.ts                     # Demo initialization
│   ├── configurator.ts             # Interactive playground with code generation
│   └── react-demo/
│       ├── index.html              # React demo entry
│       ├── app.tsx                  # React demo application
│       └── main.tsx                # React demo mount
├── examples/
│   ├── vanilla/
│   │   ├── index.html              # Vanilla JS CodeSandbox example
│   │   ├── index.js                # Vanilla JS example code
│   │   ├── package.json            # Example dependencies
│   │   ├── vite.config.js          # Vite config for sandbox
│   │   └── sandbox.config.json     # CodeSandbox config
│   └── react/
│       ├── index.html              # React CodeSandbox example
│       ├── package.json            # Example dependencies
│       ├── vite.config.js          # Vite config for sandbox
│       ├── sandbox.config.json     # CodeSandbox config
│       └── src/
│           ├── App.jsx             # React example app
│           └── index.jsx           # React example mount
├── tests/
│   ├── core.test.ts                # Core functionality tests
│   ├── slider.test.ts              # Slider position and clip-path tests
│   ├── zoom.test.ts                # Zoom & pan tests
│   ├── a11y.test.ts                # Accessibility tests
│   ├── labels.test.ts              # Label system tests
│   ├── animation.test.ts           # Entrance animation tests
│   ├── data-attr.test.ts           # HTML data-attribute init tests
│   ├── react.test.tsx              # React wrapper tests
│   ├── integration.test.ts         # End-to-end integration tests
│   ├── cloudimage.test.ts          # Cloudimage URL builder tests
│   ├── dom.test.ts                 # DOM utility tests
│   ├── events.test.ts              # Event helper tests
│   └── setup.ts                    # Test setup (jsdom, global mocks)
├── config/
│   ├── vite.config.ts              # Main bundle build config
│   ├── vite.react.config.ts        # React wrapper build config
│   └── vite.demo.config.ts         # Demo build config
├── dist/                           # Built output (CDN bundles committed)
│   ├── js-cloudimage-before-after.min.js
│   └── js-cloudimage-before-after.min.js.map
├── .github/
│   └── workflows/
│       ├── deploy-demo.yml         # GitHub Pages deployment workflow
│       └── deploy-pages.yml        # GitHub Pages build workflow
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── .eslintrc.cjs
├── .gitignore
├── LICENSE
├── README.md
├── CHANGELOG.md
└── SPECS.md                        # This specification
```

---

## 12. GitHub Pages Demo

The demo site will be hosted at `https://scaleflex.github.io/js-cloudimage-before-after/` and deployed via GitHub Actions.

### 12.1 Demo Sections

| Section | Description |
|---|---|
| **Hero** | Gradient background with "Open Source Library" badge, animated heading, feature pills (Zoom & Pan, Drag/Hover/Click, WCAG 2.1 AA, Dark Mode, React Ready), dual CTA buttons (Get Started / GitHub), sandbox links, and a live before/after slider with a renovation photo |
| **Getting Started** | Side-by-side npm and CDN installation cards with dark-themed code blocks and copy-to-clipboard |
| **Interaction Modes** | 3-column responsive grid comparing drag, hover, and click modes with live examples |
| **Orientations** | Side-by-side horizontal and vertical slider examples |
| **Themes** | Light, dark, and custom-themed demonstrations |
| **Zoom & Pan** | Live example demonstrating zoom into fine details of a before/after comparison |
| **Interactive Configurator** | Two-panel layout (controls + preview) with toggles (zoom, labels, fullscreen button, animate) and selects (mode, orientation, theme, handle style, label position, zoom controls position). Real-time generated code with copy button |
| **Footer** | Modern footer with Scaleflex logo, links to documentation, GitHub, npm |

### 12.2 Interactive Configurator

A panel that lets visitors:

- Toggle configuration options: zoom, labels, fullscreen button, entrance animation
- Select values: interaction mode, orientation, theme, handle style, label position, zoom controls position
- Set slider: initial position (range input)
- See the generated JavaScript code update in real-time
- Copy the generated code to clipboard

The configurator uses `instance.update()` to apply changes without recreating the slider, with `minHeight` pinning to prevent layout shift.

### 12.3 Demo Images

Demo images will be high-quality, royalty-free before/after photographs served via Scaleflex CDN. Ideal subjects:

- **Home renovation** — kitchen or bathroom before/after
- **Photo editing** — color grading, retouching comparison
- **Landscape/seasons** — same location in different seasons or weather
- **Restoration** — old photo restored vs original

All demo images served via `https://scaleflex.cloudimg.io/v7/plugins/js-cloudimage-before-after/`.

---

## 13. Additional Features

### 13.1 Entrance Animation

When `animate` is enabled, the slider handle performs a reveal animation the first time the container enters the viewport:

1. An `IntersectionObserver` watches the container
2. When the container becomes visible (threshold: 0.3), the animation triggers
3. The handle starts at one edge (0% for horizontal, 0% for vertical) and animates to `initialPosition`
4. The animation uses `--ci-before-after-animate-duration` and `--ci-before-after-animate-easing`
5. If `animateOnce: true` (default), subsequent viewport entries do not re-trigger

**Animation config:**

```js
// Simple boolean — uses defaults (800ms, ease-out)
{ animate: true }

// Custom timing
{ animate: { duration: 1200, delay: 200, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' } }
```

### 13.2 Lazy Loading

Both images use `IntersectionObserver` to defer loading until the container enters the viewport. A CSS shimmer placeholder is shown while images load.

- Enabled by default (`lazyLoad: true`)
- The container maintains aspect ratio via `aspect-ratio` CSS property (derived from the before image once loaded) to prevent layout shift
- A loading state class `ci-before-after-loading` is applied during image load

### 13.3 Cloudimage Integration

Same implementation as the hotspot project. When a `cloudimage` configuration is provided with a valid `token`, the library automatically requests optimally-sized images from the Scaleflex Cloudimage CDN.

Both `beforeSrc` and `afterSrc` are processed independently through the Cloudimage URL builder. The behavior is identical to Section 13.3 of the hotspot spec:

- Detect container width
- Multiply by device pixel ratio
- Round to `limitFactor`
- Build Cloudimage URL
- Resize-aware updates via `ResizeObserver`
- Zoom-aware: higher resolution requested when zoomed in

### 13.4 Analytics Hooks

Event callbacks enable integration with analytics platforms:

```js
new CIBeforeAfter(el, {
  beforeSrc: '/before.jpg',
  afterSrc: '/after.jpg',
  onSlide(position) {
    analytics.track('comparison_slide', { position });
  },
  onZoom(level) {
    analytics.track('comparison_zoom', { level });
  },
  onReady() {
    analytics.track('comparison_loaded');
  },
});
```

### 13.5 Responsive Behavior

The slider is fully responsive:

- The container is `width: 100%` by default, sized by its parent
- Images use `object-fit: cover` to fill the container
- Aspect ratio is maintained via the before image's natural dimensions
- A `ResizeObserver` monitors the container for layout changes
- Handle touch target is always at least 44px for mobile accessibility
- Touch events are properly handled for mobile drag/swipe

### 13.6 SSR Compatibility

The vanilla core gracefully handles server-side rendering environments:

- No top-level `window`, `document`, or `navigator` access
- All DOM operations are guarded with environment checks
- The React wrapper initializes the slider in `useEffect` only (client-side)

---

## 14. Competitor Feature Matrix

| Feature | js-cloudimage-before-after | react-compare-slider | img-comparison-slider | react-compare-image | BeerSlider | JuxtaposeJS | DICS | react-before-after-slider-component | before-after.js | comparison-slider | slider-before-after |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **TypeScript** | Yes (first-class) | Yes | Yes | No | No | No | No | No | No | No | No |
| **Zoom & Pan** | Yes (CSS transforms) | No | No | No | No | No | No | No | No | No | No |
| **Fullscreen** | Yes (Fullscreen API) | No | No | No | No | No | No | No | No | No | No |
| **Interaction Modes** | drag, hover, click | drag, keyboard | drag, hover, keyboard | drag, hover | drag | drag, swipe | drag | drag | drag | drag | drag |
| **Orientation** | horizontal, vertical | horizontal, vertical | horizontal, vertical | horizontal, vertical | horizontal | horizontal | horizontal | horizontal | horizontal | horizontal | horizontal |
| **Labels** | Built-in, configurable | Manual (children) | Manual (slot) | Manual (overlay) | Manual | Built-in | Built-in | No | No | No | No |
| **Entrance Animation** | Yes, configurable | No | No | No | No | Yes (auto-play) | No | No | No | No | No |
| **Mobile Touch** | Yes (drag, pinch zoom) | Yes | Yes | Yes | Yes (swipe) | Yes | Yes | Basic | No | Basic | Basic |
| **Accessibility (WCAG)** | AA (role=slider) | Partial | Yes (keyboard) | No | Yes (keyboard) | No | No | No | No | No | No |
| **Theming** | CSS variables | Props/CSS | CSS variables | Props | CSS | CSS | CSS | Props | CSS | CSS | CSS variables |
| **React Support** | Yes (wrapper) | Yes (native) | Via adapter | Yes (native) | No | No | No | Yes (native) | No | No | No |
| **Vanilla JS** | Yes | No | Yes (Web Component) | No | Yes | Yes | Yes | No | Yes (jQuery) | Yes | Yes |
| **HTML Init** | Yes (data-attrs) | No (JSX) | Yes (slots) | No (JSX) | Yes (data-attrs) | Yes (data-attrs) | Yes | No (JSX) | jQuery init | JS init | JS init |
| **Bundle Format** | ESM + CJS + UMD | ESM | ESM + UMD | ESM | UMD | UMD | UMD | ESM | jQuery plugin | ESM | ESM |
| **Zero Dependencies** | Yes | Yes | Yes | Minimal | Yes | Yes | Yes | Yes | jQuery required | Yes | Yes |
| **Bundle Size (gz)** | < 12 KB | ~5 KB | ~3 KB | ~12 KB | ~2 KB | ~5 KB | ~8 KB | ~3 KB | ~5 KB + jQuery | ~2 KB | ~2 KB |
| **Cloudimage CDN** | Yes | No | No | No | No | No | No | No | No | No | No |
| **Handle Styles** | 3 built-in | Custom (children) | Custom (slot) | Line only | Line only | Line + arrows | Line only | Line only | Line only | Line only | Line only |
| **Maintained** | Active | 2 years ago | Active | 2 years ago | Unmaintained | Active | Unmaintained | Active | Unmaintained | 2 years ago | Active |
| **npm Weekly** | New | 64K | 27K | 15K | Low | Low | Low | 3K | Low | Low | Low |

### Key Differentiators

1. **Only library combining zoom/pan with before/after comparison** — no competitor has this
2. **Fullscreen mode** — no competitor offers fullscreen for image comparison
3. **Dual initialization** (JS API + HTML data-attributes) — most competitors are JS-only or React-only
4. **Three interaction modes** (drag, hover, click) in a single package with full keyboard support
5. **CSS variable theming** with light/dark presets — most use inline styles or props
6. **Cloudimage CDN integration** — unique to Scaleflex ecosystem
7. **TypeScript-first** with zero dependencies and ESM + CJS + UMD output
8. **Configurable entrance animation** with `IntersectionObserver`
9. **Three handle styles** built-in (arrows, circle, line)
10. **WCAG 2.1 AA** with proper `role="slider"` semantics — most competitors lack proper slider ARIA

---

## 15. Roadmap

### v1.0 — Core Release

- Image comparison with clip-path reveal
- Three interaction modes: drag, hover, click
- Horizontal and vertical orientations
- Three handle styles: arrows, circle, line
- Built-in before/after labels with configurable text and position
- Zoom and pan (CSS transforms, GPU-accelerated, both images in sync)
- Touch support (drag, swipe, pinch-to-zoom)
- Zoom controls UI with configurable positioning (6 positions)
- Fullscreen toggle button with Fullscreen API
- Scroll-to-zoom hint toast (Ctrl+scroll gating)
- Entrance animation (IntersectionObserver-triggered)
- Full keyboard navigation (arrow keys, Home/End, Shift for large steps)
- WCAG 2.1 AA accessibility (`role="slider"`, ARIA attributes, focus management, screen reader)
- Reduced motion support
- CSS variable theming (light and dark themes)
- JavaScript API initialization (`new CIBeforeAfter()`)
- HTML data-attribute initialization (`CIBeforeAfter.autoInit()`)
- React wrapper (`CIBeforeAfterViewer` component, `useCIBeforeAfter` hook, ref API)
- SSR compatibility
- TypeScript type definitions
- ESM + CJS + UMD build output
- CDN distribution via Scaleflex CDN
- Optional Cloudimage CDN integration (responsive image sizing, DPR-aware)
- Lazy loading via `IntersectionObserver`
- Analytics hooks (`onSlide`, `onZoom`, `onFullscreenChange`, `onReady` callbacks)
- GitHub Pages demo site with interactive configurator
- Vitest test suite
- < 12 KB gzipped bundle

### v1.1 — Polish & Community Feedback

- Performance optimizations based on real-world usage
- Additional handle styles
- Improved touch gesture handling
- Additional CSS variable hooks for deeper customization
- Community-requested features and bug fixes
- Expanded test coverage
- Documentation improvements
- Multi-comparison support (A/B/C with multiple dividers)

### v1.2 — Framework Wrappers

- **Vue wrapper** — `<CIBeforeAfterViewer>` component for Vue 3
- **Svelte wrapper** — `<CIBeforeAfterViewer>` component for Svelte

### v2.0 — Future Vision

- Video before/after comparison
- Filter/effect comparison mode (apply different CSS filters to same image)
- Side-by-side mode (instead of overlay)
- Smart initial position (detect region of interest via image analysis)
- Plugin system for community extensions
- Collaborative real-time slider sync

---

## 16. Appendices

### A. CSS Class Reference

All CSS classes use the `ci-before-after` prefix.

| Class | Element | Description |
|---|---|---|
| `.ci-before-after-container` | Outer wrapper | Root container; `position: relative; overflow: hidden` |
| `.ci-before-after-container--horizontal` | Outer wrapper | Horizontal orientation modifier |
| `.ci-before-after-container--vertical` | Outer wrapper | Vertical orientation modifier |
| `.ci-before-after-container--fullscreen` | Outer wrapper | Applied when in fullscreen mode |
| `.ci-before-after-container--dragging` | Outer wrapper | Applied while user is dragging the handle |
| `.ci-before-after-container--hover-mode` | Outer wrapper | Applied when `mode: 'hover'` |
| `.ci-before-after-container--click-mode` | Outer wrapper | Applied when `mode: 'click'` |
| `.ci-before-after-viewport` | Inner wrapper | Receives zoom/pan transforms |
| `.ci-before-after-wrapper` | Image wrapper | Contains both images; `position: relative` |
| `.ci-before-after-image` | `<img>` | Shared image class; `position: absolute; width: 100%; height: 100%; object-fit: cover` |
| `.ci-before-after-before` | `<img>` | The before image (base layer) |
| `.ci-before-after-after` | `<img>` | The after image (inside clip wrapper) |
| `.ci-before-after-clip` | Clip wrapper | `position: absolute; inset: 0; clip-path: inset(...)` |
| `.ci-before-after-handle` | Handle root | The draggable divider; `position: absolute` |
| `.ci-before-after-handle-line` | Line element | Vertical or horizontal line extending from grip |
| `.ci-before-after-handle-grip` | Grip button | Circular draggable indicator with icon |
| `.ci-before-after-handle--arrows` | Handle root | Arrows handle style modifier |
| `.ci-before-after-handle--circle` | Handle root | Circle handle style modifier |
| `.ci-before-after-handle--line` | Handle root | Line handle style modifier |
| `.ci-before-after-label` | Label element | Base label class; `position: absolute` |
| `.ci-before-after-label-before` | Label | "Before" label |
| `.ci-before-after-label-after` | Label | "After" label |
| `.ci-before-after-label--top` | Label | Top-positioned label modifier |
| `.ci-before-after-label--bottom` | Label | Bottom-positioned label modifier |
| `.ci-before-after-label--hidden` | Label | Faded out (handle nearby) |
| `.ci-before-after-zoom-controls` | Controls wrapper | Zoom button container |
| `.ci-before-after-zoom-in` | `<button>` | Zoom in button |
| `.ci-before-after-zoom-out` | `<button>` | Zoom out button |
| `.ci-before-after-zoom-reset` | `<button>` | Reset zoom button |
| `.ci-before-after-fullscreen-btn` | `<button>` | Fullscreen toggle button (top-right) |
| `.ci-before-after-loading` | Container | Applied while images are loading |
| `.ci-before-after-theme-dark` | Container | Dark theme modifier class |
| `.ci-before-after-scroll-hint` | Toast element | Scroll-to-zoom hint |
| `.ci-before-after-scroll-hint--visible` | Toast element | Applied when scroll hint is shown |
| `.ci-before-after-animate-entrance` | Container | Applied during entrance animation |

### B. Event Reference

Events are delivered via callback functions in the configuration object.

| Callback | Signature | Trigger |
|---|---|---|
| `onSlide` | `(position: number) => void` | Slider position changes (drag, hover, click, keyboard, programmatic) |
| `onZoom` | `(level: number) => void` | Zoom level changes |
| `onFullscreenChange` | `(isFullscreen: boolean) => void` | Fullscreen state changes |
| `onReady` | `() => void` | Both images loaded and slider initialized |

### C. Data Attribute Reference

All data attributes use the `data-ci-before-after-` prefix.

| Attribute | Type | Maps to |
|---|---|---|
| `data-ci-before-after-before-src` | `string` | `config.beforeSrc` |
| `data-ci-before-after-after-src` | `string` | `config.afterSrc` |
| `data-ci-before-after-before-alt` | `string` | `config.beforeAlt` |
| `data-ci-before-after-after-alt` | `string` | `config.afterAlt` |
| `data-ci-before-after-mode` | `string` | `config.mode` |
| `data-ci-before-after-orientation` | `string` | `config.orientation` |
| `data-ci-before-after-initial-position` | `number string` | `config.initialPosition` |
| `data-ci-before-after-zoom` | `boolean string` | `config.zoom` |
| `data-ci-before-after-zoom-max` | `number string` | `config.zoomMax` |
| `data-ci-before-after-zoom-min` | `number string` | `config.zoomMin` |
| `data-ci-before-after-theme` | `string` | `config.theme` |
| `data-ci-before-after-handle-style` | `string` | `config.handleStyle` |
| `data-ci-before-after-labels` | `boolean string` | `config.labels` |
| `data-ci-before-after-label-before` | `string` | `config.labels.before` |
| `data-ci-before-after-label-after` | `string` | `config.labels.after` |
| `data-ci-before-after-label-position` | `string` | `config.labelPosition` |
| `data-ci-before-after-animate` | `boolean string` | `config.animate` |
| `data-ci-before-after-animate-duration` | `number string` | `config.animate.duration` |
| `data-ci-before-after-animate-delay` | `number string` | `config.animate.delay` |
| `data-ci-before-after-animate-easing` | `string` | `config.animate.easing` |
| `data-ci-before-after-animate-once` | `boolean string` | `config.animateOnce` |
| `data-ci-before-after-fullscreen-button` | `boolean string` | `config.fullscreenButton` |
| `data-ci-before-after-lazy-load` | `boolean string` | `config.lazyLoad` |
| `data-ci-before-after-zoom-controls` | `boolean string` | `config.zoomControls` |
| `data-ci-before-after-zoom-controls-position` | `string` | `config.zoomControlsPosition` |
| `data-ci-before-after-scroll-hint` | `boolean string` | `config.scrollHint` |
| `data-ci-before-after-keyboard-step` | `number string` | `config.keyboardStep` |
| `data-ci-before-after-keyboard-large-step` | `number string` | `config.keyboardLargeStep` |
| `data-ci-before-after-ci-token` | `string` | `config.cloudimage.token` |
| `data-ci-before-after-ci-api-version` | `string` | `config.cloudimage.apiVersion` |
| `data-ci-before-after-ci-domain` | `string` | `config.cloudimage.domain` |
| `data-ci-before-after-ci-limit-factor` | `number string` | `config.cloudimage.limitFactor` |
| `data-ci-before-after-ci-params` | `string` | `config.cloudimage.params` |
