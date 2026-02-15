# Polishing: Full Codebase Review Findings

## Critical Issues

### P-01: No tests for zoom clip-sync feature
- **Location:** `tests/slider.test.ts`, `tests/zoom.test.ts`
- **Detail:** `updateClipPath()` with `ClipZoomInfo` parameter has zero test coverage. The formula, clamping, both orientations, `syncClip()` integration, and `onTransformChange` callback are all untested.
- **Fix:** Add dedicated test cases for zoom-aware clip-path calculation.
- **Status:** FIXED

### P-02: User callbacks not wrapped in try-catch
- **Location:** `src/core/ci-before-after.ts` (lines 454, 629-630, 663)
- **Detail:** `onSlide`, `onZoom`, `onReady`, `onFullscreenChange` callbacks can throw and crash the slider. A throwing `onSlide` during drag orphans timers and leaves stale state.
- **Fix:** Wrap all user callbacks in try-catch with console.error.
- **Status:** FIXED

### P-03: Cloudimage URL params encoding issue
- **Location:** `src/utils/cloudimage.ts:46`
- **Detail:** Uses `encodeURI()` on params which doesn't encode `&`, `=`, `?`. If params contains `&w=5000`, it overrides the width parameter. However, the Cloudimage API expects raw query params like `q=80&org_if_sml=1`, so encoding them would break valid usage.
- **Fix:** Remove the `encodeURI()` call entirely — params are already expected to be valid query string segments. Add a comment documenting this expectation.
- **Status:** FIXED

## Medium Issues

### P-04: State duplication between core and ZoomPanController
- **Location:** `src/core/ci-before-after.ts`, `src/core/types.ts`
- **Detail:** `state.zoomLevel`, `state.panX`, `state.panY` are duplicated in both `SliderState` and `ZoomPanController`. `getZoom()` reads from the controller, not state — they can diverge.
- **Fix:** Future refactor to make ZoomPanController the single source of truth and remove duplicates from SliderState.
- **Status:** OPEN (low risk, works correctly today)

### P-05: React dependency arrays are fragile
- **Location:** `src/react/ci-before-after-viewer.tsx:95-124`, `src/react/use-ci-before-after.ts:48-77`
- **Detail:** Massive manual dependency arrays with eslint-disable. If a new config prop is added and not included, updates won't trigger.
- **Fix:** Future refactor to use a serialized config key or object ref comparison.
- **Status:** OPEN

### P-06: Duplicate update logic in React wrapper
- **Location:** `src/react/ci-before-after-viewer.tsx`, `src/react/use-ci-before-after.ts`
- **Detail:** Hook and component have near-identical update effects — DRY violation.
- **Fix:** Extract shared logic to a common utility hook.
- **Status:** OPEN

### P-07: Fullscreen errors silently swallowed
- **Location:** `src/core/ci-before-after.ts:105-109`
- **Detail:** `.catch(() => {})` on fullscreen methods — consumers have no way to know fullscreen failed.
- **Fix:** Future improvement to return status or fire error callback.
- **Status:** OPEN

### P-08: JSON.stringify for config comparison
- **Location:** `src/core/ci-before-after.ts:127`
- **Detail:** `JSON.stringify(this.config.cloudimage) !== JSON.stringify(oldConfig.cloudimage)` is unreliable if property order differs.
- **Fix:** Use shallow equality comparison instead.
- **Status:** FIXED

### P-09: Pinch center fixed during gesture
- **Location:** `src/zoom/gestures.ts`
- **Detail:** Pinch center is calculated at `touchstart` but not updated during `touchmove`. Long pinch gestures zoom around a fixed point rather than following fingers.
- **Fix:** Recalculate center in `onTouchMove`.
- **Status:** OPEN

### P-10: `hasAnimated` is dead code
- **Location:** `src/core/types.ts:102`, `src/core/ci-before-after.ts:61`
- **Detail:** `SliderState.hasAnimated` is never read or written after initialization.
- **Fix:** Remove from interface and state initialization.
- **Status:** FIXED

### P-11: Double element resolution
- **Location:** `src/index.ts:42`, `src/core/ci-before-after.ts:51`
- **Detail:** `CIBeforeAfter` subclass resolves the element, then `CIBeforeAfterCore` constructor calls `resolveElement(target)` again on the already-resolved element. Redundant DOM lookup.
- **Fix:** Change core constructor to accept `HTMLElement` directly.
- **Status:** FIXED

### P-12: Zoom control buttons not disabled at limits
- **Location:** `src/zoom/controls.ts`
- **Detail:** No visual or ARIA feedback when zoom is at `zoomMax` or `zoomMin`. Buttons remain clickable (handler just clamps silently).
- **Fix:** Future improvement to disable buttons and set `aria-disabled` at zoom limits.
- **Status:** OPEN

## Low / Polish Issues

### P-13: Hardcoded 15% label fade threshold
- **Location:** `src/labels/labels.ts`
- **Detail:** Labels fade at 15%/85% position with no configuration option.
- **Status:** OPEN

### P-14: Hardcoded 30% IntersectionObserver threshold
- **Location:** `src/animation/entrance.ts`
- **Detail:** Entrance animation triggers at 30% visibility, not configurable.
- **Status:** OPEN

### P-15: Focus color hardcoded in CSS
- **Location:** `src/styles/index.css:183, 417`
- **Detail:** `#4d90fe` for focus ring should be a CSS variable for theming consistency.
- **Status:** OPEN

### P-16: Container aria-label too generic
- **Location:** `src/a11y/aria.ts`
- **Detail:** "Before and after image comparison" doesn't differentiate multiple instances on a page.
- **Status:** OPEN

### P-17: No aria-live region for position changes
- **Location:** `src/a11y/aria.ts`
- **Detail:** Screen reader users must actively poll `aria-valuenow`; no live announcement of position changes.
- **Status:** OPEN

### P-18: No double-tap debounce on zoom toggle
- **Location:** `src/zoom/gestures.ts`
- **Detail:** Rapid double-taps could trigger multiple zoom toggles.
- **Status:** OPEN

## Test Coverage Gaps

### T-01: Zoom clip-sync (0% → covered)
- **Status:** FIXED — tests added in `tests/slider.test.ts`

### T-02: ZoomPanController internal logic (~5%)
- setZoom, pan clamping, center-point preservation, wheel handling, resetZoom
- **Status:** OPEN

### T-03: Zoom gestures (0%)
- Double-click toggle, mouse drag panning, pinch, touch pan, Safari GestureEvent
- **Status:** OPEN

### T-04: Slider gesture modes (0%)
- Mouse drag, hover, click modes; RAF batching; AbortController cleanup
- **Status:** OPEN

### T-05: Fullscreen manager (0%)
- Button creation, enter/exit, toggle, ARIA, icon switching, state, cleanup
- **Status:** OPEN

### T-06: React wrapper (0%)
- Hook initialization, config updates, cleanup on unmount
- **Status:** OPEN
