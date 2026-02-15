<p align="center">
  <img src="https://scaleflex.cloudimg.io/v7/plugins/js-cloudimage-360-view/logo_scaleflex_on_white_bg.jpg?vh=91b12d&w=700" alt="Scaleflex" width="350">
</p>

<h1 align="center">js-cloudimage-before-after</h1>

<p align="center">
  Interactive before/after image comparison slider with zoom, labels, and accessibility. Zero dependencies.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/js-cloudimage-before-after"><img src="https://img.shields.io/npm/v/js-cloudimage-before-after.svg?style=flat-square" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/js-cloudimage-before-after"><img src="https://img.shields.io/npm/dm/js-cloudimage-before-after.svg?style=flat-square" alt="npm downloads"></a>
  <a href="https://github.com/scaleflex/js-cloudimage-before-after/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/js-cloudimage-before-after.svg?style=flat-square" alt="license"></a>
  <a href="https://bundlephobia.com/package/js-cloudimage-before-after"><img src="https://img.shields.io/bundlephobia/minzip/js-cloudimage-before-after?style=flat-square" alt="bundle size"></a>
</p>

<p align="center">
  <a href="https://scaleflex.github.io/js-cloudimage-before-after/">Live Demo</a> |
  <a href="https://codesandbox.io/p/devbox/github/scaleflex/js-cloudimage-before-after/tree/main/examples/vanilla">Vanilla Sandbox</a> |
  <a href="https://codesandbox.io/p/devbox/github/scaleflex/js-cloudimage-before-after/tree/main/examples/react">React Sandbox</a>
</p>

---

## Why js-cloudimage-before-after?

Existing before/after sliders are often rigid, inaccessible, or missing features like zoom and vertical orientation. This library was built to fill the gap:

- **Lightweight** — under 15 KB gzipped with zero runtime dependencies
- **Accessible by default** — WCAG 2.1 AA compliant out of the box
- **Framework-agnostic** — works with vanilla JS, React, or any framework
- **Built-in zoom & pan** — no need for a separate zoom library
- **Multiple interaction modes** — drag, hover, or click
- **Optional Cloudimage CDN** — serve optimally-sized images automatically

---

## Features

- **Three interaction modes** — Drag, hover, or click to reveal before/after
- **Horizontal & vertical** — Slider works in both orientations
- **Zoom & Pan** — CSS transform-based with mouse wheel, pinch-to-zoom, double-click, drag-to-pan
- **Handle styles** — Arrows, circle, or minimal line
- **Labels** — Customizable before/after labels with configurable position
- **Entrance animation** — Smooth slider animation on first view with configurable duration, delay, and easing
- **Fullscreen mode** — Built-in fullscreen toggle
- **WCAG 2.1 AA** — Full keyboard navigation, ARIA attributes, focus management, reduced motion
- **CSS variable theming** — Light and dark themes, fully customizable
- **Two init methods** — JavaScript API and HTML data-attributes
- **React wrapper** — Separate entry point with component, hook, and ref API
- **TypeScript** — Full type definitions
- **Cloudimage CDN** — Optional responsive image loading
- **Lazy loading** — IntersectionObserver-based image lazy loading

## Installation

```bash
npm install js-cloudimage-before-after
```

### CDN

```html
<script src="https://scaleflex.cloudimg.io/v7/plugins/js-cloudimage-before-after/1.0.0/js-cloudimage-before-after.min.js?vh=ad6399&func=proxy"></script>
```

## Quick Start

### JavaScript API

```js
import CIBeforeAfter from 'js-cloudimage-before-after';

const viewer = new CIBeforeAfter('#slider', {
  beforeSrc: 'https://example.com/kitchen-before.jpg',
  afterSrc: 'https://example.com/kitchen-after.jpg',
  beforeAlt: 'Kitchen before renovation',
  afterAlt: 'Kitchen after renovation',
  zoom: true,
  labels: { before: 'Before', after: 'After' },
  theme: 'light',
  handleStyle: 'arrows',
  animate: { duration: 800 },
  onSlide(position) {
    console.log('Position:', position);
  },
});
```

### HTML Data-Attributes

```html
<div
  data-ci-before-after-before-src="https://example.com/before.jpg"
  data-ci-before-after-after-src="https://example.com/after.jpg"
  data-ci-before-after-before-alt="Before renovation"
  data-ci-before-after-after-alt="After renovation"
  data-ci-before-after-zoom="true"
  data-ci-before-after-theme="light"
  data-ci-before-after-handle-style="arrows"
  data-ci-before-after-label-before="Before"
  data-ci-before-after-label-after="After"
></div>

<script>CIBeforeAfter.autoInit();</script>
```

## API Reference

### Constructor

```ts
new CIBeforeAfter(element: HTMLElement | string, config: CIBeforeAfterConfig)
```

### Config

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `beforeSrc` | `string` | — | Before image URL (required) |
| `afterSrc` | `string` | — | After image URL (required) |
| `beforeAlt` | `string` | `'Before'` | Before image alt text |
| `afterAlt` | `string` | `'After'` | After image alt text |
| `mode` | `'drag' \| 'hover' \| 'click'` | `'drag'` | Interaction mode |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Slider direction |
| `initialPosition` | `number` | `50` | Starting position (0–100) |
| `handleStyle` | `'arrows' \| 'circle' \| 'line'` | `'arrows'` | Handle visual style |
| `labels` | `boolean \| { before?: string; after?: string }` | `true` | Show labels or custom text |
| `labelPosition` | `'top' \| 'bottom'` | `'top'` | Label placement |
| `theme` | `'light' \| 'dark'` | `'light'` | Color theme |
| `zoom` | `boolean` | `false` | Enable zoom & pan |
| `zoomMax` | `number` | `4` | Maximum zoom level |
| `zoomMin` | `number` | `1` | Minimum zoom level |
| `zoomControls` | `boolean` | `true` | Show zoom control buttons |
| `zoomControlsPosition` | `string` | `'bottom-right'` | Zoom controls position (`top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`) |
| `scrollHint` | `boolean` | `true` | Show scroll hint when zoomed |
| `animate` | `boolean \| AnimateConfig` | `false` | Entrance animation |
| `animateOnce` | `boolean` | `true` | Animate only on first view |
| `fullscreenButton` | `boolean` | `true` | Show fullscreen button |
| `lazyLoad` | `boolean` | `true` | Lazy load images |
| `keyboardStep` | `number` | `1` | Arrow key step (%) |
| `keyboardLargeStep` | `number` | `10` | Shift+Arrow step (%) |
| `onSlide` | `(position: number) => void` | — | Position change callback |
| `onZoom` | `(level: number) => void` | — | Zoom change callback |
| `onFullscreenChange` | `(isFullscreen: boolean) => void` | — | Fullscreen callback |
| `onReady` | `() => void` | — | Ready callback |
| `cloudimage` | `CloudimageConfig` | — | Cloudimage CDN config |

### AnimateConfig

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `duration` | `number` | `800` | Duration in ms |
| `delay` | `number` | `0` | Delay before start in ms |
| `easing` | `string` | `'ease-out'` | CSS easing function |

### Instance Methods

```ts
instance.setPosition(percent: number): void     // Set slider position (0–100)
instance.getPosition(): number                   // Get current position
instance.setZoom(level: number): void            // Set zoom level
instance.getZoom(): number                       // Get current zoom level
instance.resetZoom(): void                       // Reset zoom to 1×
instance.enterFullscreen(): void                 // Enter fullscreen
instance.exitFullscreen(): void                  // Exit fullscreen
instance.isFullscreen(): boolean                 // Check fullscreen state
instance.update(config: Partial<Config>): void   // Update config
instance.destroy(): void                         // Destroy instance
instance.getElements(): Elements                 // Get DOM elements
```

### Static Methods

```ts
CIBeforeAfter.autoInit(root?: HTMLElement): CIBeforeAfterInstance[]
```

## React Usage

```tsx
import { CIBeforeAfterViewer, useCIBeforeAfter } from 'js-cloudimage-before-after/react';

// Component
function ImageComparison() {
  return (
    <CIBeforeAfterViewer
      beforeSrc="/kitchen-before.jpg"
      afterSrc="/kitchen-after.jpg"
      beforeAlt="Kitchen before renovation"
      afterAlt="Kitchen after renovation"
      zoom
      labels={{ before: 'Before', after: 'After' }}
      handleStyle="arrows"
      animate={{ duration: 800 }}
      onSlide={(pos) => console.log('Position:', pos)}
    />
  );
}

// Hook
function ImageComparison() {
  const { containerRef, instance } = useCIBeforeAfter({
    beforeSrc: '/kitchen-before.jpg',
    afterSrc: '/kitchen-after.jpg',
    zoom: true,
  });

  return (
    <>
      <div ref={containerRef} />
      <button onClick={() => instance.current?.setZoom(2)}>Zoom 2×</button>
    </>
  );
}

// Ref API
function ImageComparison() {
  const ref = useRef<CIBeforeAfterViewerRef>(null);
  return (
    <>
      <CIBeforeAfterViewer
        ref={ref}
        beforeSrc="/kitchen-before.jpg"
        afterSrc="/kitchen-after.jpg"
        zoom
      />
      <button onClick={() => ref.current?.setPosition(75)}>Show 75%</button>
    </>
  );
}
```

## Theming

All visuals are customizable via CSS variables:

```css
.my-viewer {
  --ci-before-after-border-radius: 12px;
  --ci-before-after-handle-color: #0058a3;
  --ci-before-after-handle-size: 44px;
  --ci-before-after-handle-border: 2px solid white;
  --ci-before-after-label-bg: rgba(0, 0, 0, 0.6);
  --ci-before-after-label-color: #fff;
  --ci-before-after-label-radius: 4px;
}
```

Set `theme: 'dark'` for the built-in dark theme.

## Accessibility

- Slider handle is a focusable element with `role="slider"` and `aria-valuenow`
- `Arrow keys` move the slider position
- `Shift + Arrow` moves in larger steps
- `Home` / `End` jump to 0% / 100%
- `+` / `-` / `0` control zoom
- `Escape` exits fullscreen
- `prefers-reduced-motion` disables animations
- Before/after images have configurable alt text

## Cloudimage Integration

```js
new CIBeforeAfter('#el', {
  beforeSrc: 'https://example.com/before.jpg',
  afterSrc: 'https://example.com/after.jpg',
  cloudimage: {
    token: 'demo',
    limitFactor: 100,
    params: 'q=80',
  },
});
```

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome  | 80+     |
| Firefox | 80+     |
| Safari  | 14+     |
| Edge    | 80+     |

## License

[MIT](./LICENSE)

---

## Support

If this library helped your project, consider buying me a coffee!

<a href="https://buymeacoffee.com/dzmitry.stramavus">
  <img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me A Coffee">
</a>

---

<p align="center">
  Made with care by the <a href="https://www.scaleflex.com">Scaleflex</a> team
</p>
