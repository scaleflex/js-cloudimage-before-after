const fe = ["drag", "hover", "click"], de = ["horizontal", "vertical"], me = ["light", "dark"], be = ["arrows", "circle", "line"], ue = ["top", "bottom"], ge = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right"
], d = {
  beforeAlt: "Before",
  afterAlt: "After",
  mode: "drag",
  orientation: "horizontal",
  initialPosition: 50,
  zoom: !1,
  zoomMax: 4,
  zoomMin: 1,
  theme: "light",
  handleStyle: "arrows",
  labelPosition: "top",
  animateOnce: !0,
  fullscreenButton: !0,
  lazyLoad: !0,
  zoomControls: !0,
  zoomControlsPosition: "bottom-right",
  scrollHint: !0,
  keyboardStep: 1,
  keyboardLargeStep: 10
};
function V(o) {
  const e = o.labels;
  let t = !0, i = "Before", n = "After";
  e === !1 ? t = !1 : typeof e == "object" && (i = e.before ?? "Before", n = e.after ?? "After");
  const r = o.animate;
  let s = !1, l = 800, a = 0, c = "ease-out";
  r === !0 ? s = !0 : typeof r == "object" && (s = !0, l = Math.max(0, r.duration ?? 800), a = Math.max(0, r.delay ?? 0), c = r.easing ?? "ease-out");
  const h = o.zoom ?? d.zoom;
  return {
    beforeSrc: o.beforeSrc,
    afterSrc: o.afterSrc,
    beforeAlt: o.beforeAlt ?? d.beforeAlt,
    afterAlt: o.afterAlt ?? d.afterAlt,
    mode: z(o.mode, fe, d.mode, "mode"),
    orientation: z(o.orientation, de, d.orientation, "orientation"),
    initialPosition: we(o.initialPosition ?? d.initialPosition),
    zoom: h,
    zoomMax: Math.max(1, o.zoomMax ?? d.zoomMax),
    zoomMin: Math.max(1, Math.min(o.zoomMin ?? d.zoomMin, o.zoomMax ?? d.zoomMax)),
    theme: z(o.theme, me, d.theme, "theme"),
    handleStyle: z(o.handleStyle, be, d.handleStyle, "handleStyle"),
    labelsEnabled: t,
    labelBefore: i,
    labelAfter: n,
    labelPosition: z(o.labelPosition, ue, d.labelPosition, "labelPosition"),
    animateEnabled: s,
    animateDuration: l,
    animateDelay: a,
    animateEasing: c,
    animateOnce: o.animateOnce ?? d.animateOnce,
    fullscreenButton: o.fullscreenButton ?? d.fullscreenButton,
    lazyLoad: o.lazyLoad ?? d.lazyLoad,
    zoomControls: o.zoomControls ?? (h ? d.zoomControls : !1),
    zoomControlsPosition: z(o.zoomControlsPosition, ge, d.zoomControlsPosition, "zoomControlsPosition"),
    scrollHint: o.scrollHint ?? (h ? d.scrollHint : !1),
    keyboardStep: Math.max(0.5, o.keyboardStep ?? d.keyboardStep),
    keyboardLargeStep: Math.max(1, o.keyboardLargeStep ?? d.keyboardLargeStep),
    onSlide: o.onSlide,
    onZoom: o.onZoom,
    onFullscreenChange: o.onFullscreenChange,
    onReady: o.onReady,
    aspectRatio: o.aspectRatio,
    cloudimage: o.cloudimage
  };
}
function w(o, e, t) {
  if (e.includes(o)) return o;
  console.warn(`CIBeforeAfter: Invalid ${t} "${o}". Allowed: ${e.join(", ")}`);
}
function z(o, e, t, i) {
  return o === void 0 ? t : e.includes(o) ? o : (console.warn(`CIBeforeAfter: Invalid ${i} "${o}". Allowed: ${e.join(", ")}. Using default "${t}".`), t);
}
function ve(o) {
  const e = (k) => o.getAttribute(`data-ci-before-after-${k}`), t = (k) => {
    const x = e(k);
    if (x !== null)
      return x === "true";
  }, i = (k) => {
    const x = e(k);
    if (x === null) return;
    const G = parseFloat(x);
    return isNaN(G) ? void 0 : G;
  }, n = e("before-src"), r = e("after-src");
  if (!n || !r)
    throw new Error("CIBeforeAfter: data-ci-before-after-before-src and data-ci-before-after-after-src are required");
  const s = {
    beforeSrc: n,
    afterSrc: r
  }, l = e("before-alt");
  l !== null && (s.beforeAlt = l);
  const a = e("after-alt");
  a !== null && (s.afterAlt = a);
  const c = e("mode");
  c && (s.mode = w(c, fe, "mode"));
  const h = e("orientation");
  h && (s.orientation = w(h, de, "orientation"));
  const m = i("initial-position");
  m !== void 0 && (s.initialPosition = m);
  const b = t("zoom");
  b !== void 0 && (s.zoom = b);
  const p = i("zoom-max");
  p !== void 0 && (s.zoomMax = p);
  const g = i("zoom-min");
  g !== void 0 && (s.zoomMin = g);
  const u = e("theme");
  u && (s.theme = w(u, me, "theme"));
  const y = e("handle-style");
  y && (s.handleStyle = w(y, be, "handleStyle"));
  const P = t("labels"), C = e("label-before"), T = e("label-after");
  P === !1 ? s.labels = !1 : C !== null || T !== null ? s.labels = {
    before: C ?? void 0,
    after: T ?? void 0
  } : P === !0 && (s.labels = !0);
  const O = e("label-position");
  O && (s.labelPosition = w(O, ue, "labelPosition"));
  const D = t("animate"), Z = i("animate-duration"), R = i("animate-delay"), A = e("animate-easing");
  Z !== void 0 || R !== void 0 || A != null ? s.animate = {
    duration: Z,
    delay: R,
    easing: A ?? void 0
  } : D !== void 0 && (s.animate = D);
  const H = t("animate-once");
  H !== void 0 && (s.animateOnce = H);
  const B = t("fullscreen-button");
  B !== void 0 && (s.fullscreenButton = B);
  const $ = t("lazy-load");
  $ !== void 0 && (s.lazyLoad = $);
  const F = t("zoom-controls");
  F !== void 0 && (s.zoomControls = F);
  const Y = e("zoom-controls-position");
  Y && (s.zoomControlsPosition = w(Y, ge, "zoomControlsPosition"));
  const X = t("scroll-hint");
  X !== void 0 && (s.scrollHint = X);
  const W = i("keyboard-step");
  W !== void 0 && (s.keyboardStep = W);
  const N = i("keyboard-large-step");
  N !== void 0 && (s.keyboardLargeStep = N);
  const j = e("aspect-ratio");
  j !== null && (s.aspectRatio = j);
  const _ = e("ci-token");
  return _ && (s.cloudimage = {
    token: _,
    apiVersion: e("ci-api-version") ?? void 0,
    domain: e("ci-domain") ?? void 0,
    limitFactor: i("ci-limit-factor"),
    params: e("ci-params") ?? void 0
  }), s;
}
function we(o) {
  return isFinite(o) ? Math.max(0, Math.min(100, o)) : 50;
}
const U = "ci-before-after-styles";
function q(o) {
  if (!S() || document.getElementById(U)) return;
  const e = document.createElement("style");
  e.id = U, e.textContent = o, document.head.appendChild(e);
}
function f(o, e, t) {
  const i = document.createElement(o);
  if (e && (i.className = e), t)
    for (const [n, r] of Object.entries(t))
      i.setAttribute(n, r);
  return i;
}
function ze(o) {
  if (typeof o == "string") {
    const e = document.querySelector(o);
    if (!e)
      throw new Error(`CIBeforeAfter: Element not found for selector "${o}"`);
    return e;
  }
  return o;
}
function S() {
  return typeof window < "u" && typeof document < "u";
}
function I() {
  if (!S()) return !1;
  const o = document;
  return !!(o.fullscreenEnabled || o.webkitFullscreenEnabled);
}
function ye(o) {
  const e = o;
  return e.requestFullscreen ? e.requestFullscreen() : e.webkitRequestFullscreen ? e.webkitRequestFullscreen() : Promise.reject(new Error("Fullscreen API not supported"));
}
function K() {
  const o = document;
  return o.exitFullscreen ? o.exitFullscreen() : o.webkitExitFullscreen ? o.webkitExitFullscreen() : Promise.reject(new Error("Fullscreen API not supported"));
}
function J() {
  const o = document;
  return o.fullscreenElement || o.webkitFullscreenElement || null;
}
class v {
  constructor() {
    this.cleanups = [];
  }
  on(e, t, i, n) {
    e.addEventListener(t, i, n), this.cleanups.push(() => e.removeEventListener(t, i, n));
  }
  onPassive(e, t, i) {
    this.on(e, t, i, { passive: !0 });
  }
  onNonPassive(e, t, i) {
    this.on(e, t, i, { passive: !1 });
  }
  destroy() {
    for (const e of this.cleanups)
      e();
    this.cleanups = [];
  }
}
function Pe(o, e) {
  var n;
  let t, i;
  if ("touches" in o) {
    const r = o.touches[0] || ((n = o.changedTouches) == null ? void 0 : n[0]);
    if (!r) return { x: 0, y: 0 };
    t = r.clientX, i = r.clientY;
  } else
    t = o.clientX, i = o.clientY;
  return {
    x: t - e.left,
    y: i - e.top
  };
}
function E(o, e, t) {
  const { x: i, y: n } = Pe(o, e), r = t === "horizontal" ? e.width : e.height;
  return r === 0 ? 50 : Math.max(0, Math.min(100, (t === "horizontal" ? i : n) / r * 100));
}
const Ce = /^[a-zA-Z0-9_-]+$/, ke = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, xe = /^v\d+$/;
function Le(o) {
  if (!Ce.test(o.token))
    throw new Error(`CIBeforeAfter: Invalid cloudimage token "${o.token}". Must match [a-zA-Z0-9_-]+`);
  if (o.domain && !ke.test(o.domain))
    throw new Error(`CIBeforeAfter: Invalid cloudimage domain "${o.domain}".`);
  if (o.apiVersion && !xe.test(o.apiVersion))
    throw new Error(`CIBeforeAfter: Invalid cloudimage apiVersion "${o.apiVersion}". Must be "v" followed by digits.`);
}
function Ee(o, e, t) {
  Le(t);
  const {
    token: i,
    apiVersion: n = "v7",
    domain: r = "cloudimg.io",
    limitFactor: s = 100,
    params: l = "",
    devicePixelRatioList: a = [1, 1.5, 2]
  } = t, c = typeof window < "u" && window.devicePixelRatio || 1, m = (a.length > 0 ? a : [1]).reduce(
    (P, C) => Math.abs(C - c) < Math.abs(P - c) ? C : P
  ), b = s > 0 ? s : 100, p = e * m, g = Math.ceil(p / b) * b, u = `https://${i}.${r}/${n}`, y = l ? `?${l}&w=${g}` : `?w=${g}`;
  return o.startsWith("http://") || o.startsWith("https://") ? `${u}/${o}${y}` : `${u}/${o}${y}`;
}
function M(o, e, t, i) {
  let n = e;
  i && i.level > 1 && (t === "horizontal" ? n = e / i.level - i.panX * 100 / (i.level * i.containerWidth) : n = e / i.level - i.panY * 100 / (i.level * i.containerHeight), n = Math.max(0, Math.min(100, n)));
  const r = t === "horizontal" ? `inset(0 0 0 ${n}%)` : `inset(${n}% 0 0 0)`;
  o.style.clipPath = r, o.style.setProperty("-webkit-clip-path", r);
}
function Ae(o, e, t) {
  t === "horizontal" ? (o.style.left = `${e}%`, o.style.top = "") : (o.style.top = `${e}%`, o.style.left = "");
}
function Q(o) {
  return isFinite(o) ? Math.max(0, Math.min(100, o)) : 50;
}
const Ie = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>', Me = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>', Se = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>', Te = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>', Oe = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 8 22 12 18 16"/><polyline points="6 8 2 12 6 16"/><line x1="2" x2="22" y1="12" y2="12"/></svg>', De = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="8 18 12 22 16 18"/><polyline points="8 6 12 2 16 6"/><line x1="12" x2="12" y1="2" y2="22"/></svg>';
function ee(o, e, t) {
  const i = f("div", `ci-before-after-handle ci-before-after-handle--${o}`, {
    role: "slider",
    "aria-valuenow": String(Math.round(t)),
    "aria-valuemin": "0",
    "aria-valuemax": "100",
    "aria-label": "Image comparison slider. Use arrow keys to adjust the before and after split position.",
    "aria-orientation": e,
    tabindex: "0"
  });
  switch (e === "horizontal" ? i.style.left = `${t}%` : i.style.top = `${t}%`, o) {
    case "arrows":
      Ze(i, e);
      break;
    case "circle":
      Re(i, e);
      break;
    case "line":
      He(i);
      break;
  }
  return i;
}
function Ze(o, e) {
  const t = f("div", "ci-before-after-handle-line"), i = f("div", "ci-before-after-handle-grip"), n = f("div", "ci-before-after-handle-line");
  e === "horizontal" ? i.innerHTML = Ie + Me : i.innerHTML = Se + Te, o.append(t, i, n);
}
function Re(o, e) {
  const t = f("div", "ci-before-after-handle-grip");
  e === "horizontal" ? t.innerHTML = Oe : t.innerHTML = De, o.append(t);
}
function He(o) {
  const e = f("div", "ci-before-after-handle-line"), t = f("div", "ci-before-after-handle-grip ci-before-after-handle-grip--pill"), i = f("div", "ci-before-after-handle-line");
  o.append(e, t, i);
}
class te {
  constructor(e, t, i, n, r) {
    this.container = e, this.handle = t, this.mode = i, this.orientation = n, this.callbacks = r, this.events = new v(), this.containerRect = null, this.rafId = null, this.pendingPosition = null, this.abortController = null, this.bind();
  }
  bind() {
    switch (this.mode) {
      case "drag":
        this.bindDrag();
        break;
      case "hover":
        this.bindHover();
        break;
      case "click":
        this.bindClick();
        break;
    }
  }
  bindDrag() {
    this.events.on(this.handle, "mousedown", (e) => {
      e.preventDefault(), this.startDrag();
    }), this.events.on(this.handle, "touchstart", (e) => {
      e.preventDefault(), this.handle.focus(), this.startTouchDrag();
    }, { passive: !1 });
  }
  startDrag() {
    this.cleanupWindowListeners(), this.abortController = new AbortController();
    const e = this.abortController.signal;
    this.containerRect = this.container.getBoundingClientRect(), this.callbacks.onDragStart();
    const t = (n) => {
      if (!this.containerRect) return;
      const r = E(n, this.containerRect, this.orientation);
      this.schedulePositionUpdate(r);
    }, i = () => {
      this.flushPositionUpdate(), this.callbacks.onDragEnd(), this.containerRect = null, this.cleanupWindowListeners();
    };
    window.addEventListener("mousemove", t, { signal: e }), window.addEventListener("mouseup", i, { signal: e });
  }
  startTouchDrag() {
    this.cleanupWindowListeners(), this.abortController = new AbortController();
    const e = this.abortController.signal;
    this.containerRect = this.container.getBoundingClientRect(), this.callbacks.onDragStart();
    const t = (n) => {
      if (!this.containerRect || n.touches.length !== 1) return;
      n.preventDefault();
      const r = E(n, this.containerRect, this.orientation);
      this.schedulePositionUpdate(r);
    }, i = () => {
      this.flushPositionUpdate(), this.callbacks.onDragEnd(), this.containerRect = null, this.cleanupWindowListeners();
    };
    window.addEventListener("touchmove", t, { passive: !1, signal: e }), window.addEventListener("touchend", i, { signal: e }), window.addEventListener("touchcancel", i, { signal: e });
  }
  schedulePositionUpdate(e) {
    this.pendingPosition = e, this.rafId === null && (this.rafId = requestAnimationFrame(() => {
      this.rafId = null, this.pendingPosition !== null && (this.callbacks.onPositionChange(this.pendingPosition), this.pendingPosition = null);
    }));
  }
  flushPositionUpdate() {
    this.rafId !== null && (cancelAnimationFrame(this.rafId), this.rafId = null), this.pendingPosition !== null && (this.callbacks.onPositionChange(this.pendingPosition), this.pendingPosition = null);
  }
  cleanupWindowListeners() {
    this.abortController && (this.abortController.abort(), this.abortController = null);
  }
  bindHover() {
    this.events.on(this.container, "mousemove", (e) => {
      const t = this.container.getBoundingClientRect(), i = E(e, t, this.orientation);
      this.schedulePositionUpdate(i);
    });
  }
  bindClick() {
    this.events.on(this.container, "click", (e) => {
      if (this.handle.contains(e.target)) return;
      const t = this.container.getBoundingClientRect(), i = E(e, t, this.orientation);
      this.callbacks.onPositionChange(i);
    });
  }
  updateMode(e) {
    this.events.destroy(), this.cleanupWindowListeners(), this.flushPositionUpdate(), this.mode = e, this.bind();
  }
  updateOrientation(e) {
    this.orientation = e;
  }
  destroy() {
    this.cleanupWindowListeners(), this.rafId !== null && (cancelAnimationFrame(this.rafId), this.rafId = null), this.pendingPosition = null, this.events.destroy(), this.containerRect = null;
  }
}
class Be {
  constructor(e, t, i, n, r) {
    this.viewport = e, this.container = t, this.config = i, this.onZoomChange = n, this.zoomLevel = 1, this.panX = 0, this.panY = 0, this.containerWidth = 0, this.containerHeight = 0, this.transitioning = !1, this.transitionEndCleanup = null, this.resizeObserver = null, this.onTransformChange = r, this.updateContainerSize(), this.observeResize();
  }
  observeResize() {
    typeof ResizeObserver > "u" || (this.resizeObserver = new ResizeObserver((e) => {
      for (const t of e) {
        const { width: i, height: n } = t.contentRect;
        this.containerWidth = i, this.containerHeight = n;
      }
    }), this.resizeObserver.observe(this.container));
  }
  getZoom() {
    return this.zoomLevel;
  }
  getContainerSize() {
    return { width: this.containerWidth, height: this.containerHeight };
  }
  setZoom(e, t, i) {
    var s;
    const n = Math.max(this.config.zoomMin, Math.min(this.config.zoomMax, e));
    if (n === this.zoomLevel) return;
    const r = this.zoomLevel;
    this.zoomLevel = n, t !== void 0 && i !== void 0 && (this.panX = t - (t - this.panX) * (n / r), this.panY = i - (i - this.panY) * (n / r)), this.clampPan(), this.applyTransform(!0), (s = this.onZoomChange) == null || s.call(this, this.zoomLevel);
  }
  zoomIn() {
    this.setZoom(
      this.zoomLevel * 1.5,
      this.containerWidth / 2,
      this.containerHeight / 2
    );
  }
  zoomOut() {
    this.setZoom(
      this.zoomLevel / 1.5,
      this.containerWidth / 2,
      this.containerHeight / 2
    );
  }
  resetZoom() {
    var e;
    this.zoomLevel = Math.max(1, this.config.zoomMin), this.panX = 0, this.panY = 0, this.applyTransform(!0), (e = this.onZoomChange) == null || e.call(this, this.zoomLevel);
  }
  getPan() {
    return { x: this.panX, y: this.panY };
  }
  setPan(e, t) {
    this.panX = e, this.panY = t, this.clampPan(), this.applyTransform(!1);
  }
  pan(e, t) {
    this.zoomLevel <= 1 || (this.panX += e, this.panY += t, this.clampPan(), this.applyTransform(!1));
  }
  handleWheel(e) {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    const t = this.container.getBoundingClientRect(), i = e.clientX - t.left, n = e.clientY - t.top, r = e.deltaY > 0 ? 0.9 : 1.1;
    this.setZoom(this.zoomLevel * r, i, n);
  }
  toggleZoom(e, t) {
    const i = Math.max(1, this.config.zoomMin);
    this.zoomLevel > i ? this.resetZoom() : this.setZoom(Math.max(2, i * 1.5), e, t);
  }
  updateConfig(e) {
    var i;
    this.config = e;
    const t = Math.max(e.zoomMin, Math.min(e.zoomMax, this.zoomLevel));
    t !== this.zoomLevel && (this.zoomLevel = t, (i = this.onZoomChange) == null || i.call(this, this.zoomLevel)), this.clampPan(), this.applyTransform(!1);
  }
  updateContainerSize() {
    const e = this.container.getBoundingClientRect();
    this.containerWidth = e.width, this.containerHeight = e.height;
  }
  clampPan() {
    if (this.zoomLevel <= 1) {
      this.panX = 0, this.panY = 0;
      return;
    }
    const e = this.containerWidth * (this.zoomLevel - 1), t = this.containerHeight * (this.zoomLevel - 1);
    this.panX = Math.max(-e, Math.min(0, this.panX)), this.panY = Math.max(-t, Math.min(0, this.panY));
  }
  applyTransform(e) {
    var t;
    if (this.transitionEndCleanup && (this.transitionEndCleanup(), this.transitionEndCleanup = null), e) {
      this.viewport.style.transition = "transform 300ms ease", this.transitioning = !0;
      const i = (n) => {
        n.target === this.viewport && (this.viewport.style.transition = "", this.transitioning = !1, this.transitionEndCleanup = null, this.viewport.removeEventListener("transitionend", i));
      };
      this.viewport.addEventListener("transitionend", i), this.transitionEndCleanup = () => {
        this.viewport.removeEventListener("transitionend", i), this.viewport.style.transition = "", this.transitioning = !1;
      };
    } else this.transitioning || (this.viewport.style.transition = "");
    this.viewport.style.transform = `scale(${this.zoomLevel}) translate(${this.panX / this.zoomLevel}px, ${this.panY / this.zoomLevel}px)`, (t = this.onTransformChange) == null || t.call(this);
  }
  destroy() {
    var e;
    this.transitionEndCleanup && (this.transitionEndCleanup(), this.transitionEndCleanup = null), this.viewport.style.transform = "", this.viewport.style.transition = "", (e = this.resizeObserver) == null || e.disconnect(), this.resizeObserver = null;
  }
}
const $e = 3;
class ie {
  constructor(e, t, i, n) {
    this.container = e, this.handle = t, this.zoomPan = i, this.scrollHintCallback = n, this.events = new v(), this.isPanning = !1, this.lastPanX = 0, this.lastPanY = 0, this.initialPinchDistance = 0, this.initialPinchZoom = 1, this.abortController = null, this.bind();
  }
  bind() {
    this.events.onNonPassive(this.container, "wheel", (e) => {
      var t;
      e.ctrlKey || e.metaKey ? this.zoomPan.handleWheel(e) : this.zoomPan.getZoom() > 1 || (t = this.scrollHintCallback) == null || t.call(this);
    }), this.events.on(this.container, "dblclick", (e) => {
      if (this.handle.contains(e.target)) return;
      const t = this.container.getBoundingClientRect();
      this.zoomPan.toggleZoom(e.clientX - t.left, e.clientY - t.top);
    }), this.events.on(this.container, "mousedown", (e) => {
      this.handle.contains(e.target) || this.zoomPan.getZoom() <= 1 || (e.preventDefault(), this.startPan(e.clientX, e.clientY));
    }), this.events.on(this.container, "touchstart", (e) => {
      this.handle.contains(e.target) || (e.touches.length === 2 ? (e.preventDefault(), this.startPinch(e)) : e.touches.length === 1 && this.zoomPan.getZoom() > 1 && (e.preventDefault(), this.startTouchPan(e)));
    }, { passive: !1 }), typeof window < "u" && "GestureEvent" in window && (this.events.onNonPassive(this.container, "gesturestart", (e) => {
      e.preventDefault(), this.initialPinchZoom = this.zoomPan.getZoom();
      const t = e, i = this.container.getBoundingClientRect();
      t.clientX - i.left, t.clientY - i.top;
    }), this.events.onNonPassive(this.container, "gesturechange", (e) => {
      e.preventDefault();
      const t = e, i = this.container.getBoundingClientRect();
      this.zoomPan.setZoom(
        this.initialPinchZoom * t.scale,
        t.clientX - i.left,
        t.clientY - i.top
      );
    }));
  }
  startPan(e, t) {
    this.cleanupWindowListeners(), this.abortController = new AbortController();
    const i = this.abortController.signal;
    this.isPanning = !1, this.lastPanX = e, this.lastPanY = t;
    const n = e, r = t, s = (a) => {
      const c = a.clientX - this.lastPanX, h = a.clientY - this.lastPanY;
      if (!this.isPanning) {
        const m = a.clientX - n, b = a.clientY - r;
        if (Math.hypot(m, b) < $e) return;
        this.isPanning = !0, this.container.style.cursor = "grabbing";
      }
      this.lastPanX = a.clientX, this.lastPanY = a.clientY, this.zoomPan.pan(c, h);
    }, l = () => {
      this.isPanning = !1, this.container.style.cursor = "", this.cleanupWindowListeners();
    };
    window.addEventListener("mousemove", s, { signal: i }), window.addEventListener("mouseup", l, { signal: i });
  }
  startTouchPan(e) {
    this.cleanupWindowListeners(), this.abortController = new AbortController();
    const t = this.abortController.signal, i = e.touches[0];
    this.lastPanX = i.clientX, this.lastPanY = i.clientY;
    const n = (s) => {
      if (s.touches.length !== 1) return;
      s.preventDefault();
      const l = s.touches[0], a = l.clientX - this.lastPanX, c = l.clientY - this.lastPanY;
      this.lastPanX = l.clientX, this.lastPanY = l.clientY, this.zoomPan.pan(a, c);
    }, r = () => {
      this.cleanupWindowListeners();
    };
    window.addEventListener("touchmove", n, { passive: !1, signal: t }), window.addEventListener("touchend", r, { signal: t }), window.addEventListener("touchcancel", r, { signal: t });
  }
  startPinch(e) {
    if (e.touches.length < 2) return;
    this.cleanupWindowListeners(), this.abortController = new AbortController();
    const t = this.abortController.signal, [i, n] = [e.touches[0], e.touches[1]];
    this.initialPinchDistance = Math.hypot(n.clientX - i.clientX, n.clientY - i.clientY), this.initialPinchDistance === 0 && (this.initialPinchDistance = 1), this.initialPinchZoom = this.zoomPan.getZoom();
    const r = this.container.getBoundingClientRect(), s = (i.clientX + n.clientX) / 2 - r.left, l = (i.clientY + n.clientY) / 2 - r.top, a = (h) => {
      if (h.touches.length !== 2) return;
      h.preventDefault();
      const [m, b] = [h.touches[0], h.touches[1]], g = Math.hypot(b.clientX - m.clientX, b.clientY - m.clientY) / this.initialPinchDistance;
      this.zoomPan.setZoom(this.initialPinchZoom * g, s, l);
    }, c = () => {
      this.cleanupWindowListeners();
    };
    window.addEventListener("touchmove", a, { passive: !1, signal: t }), window.addEventListener("touchend", c, { signal: t }), window.addEventListener("touchcancel", c, { signal: t });
  }
  cleanupWindowListeners() {
    this.abortController && (this.abortController.abort(), this.abortController = null);
  }
  destroy() {
    this.cleanupWindowListeners(), this.events.destroy();
  }
}
const Fe = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>', Ye = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>', Xe = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>';
function oe(o, e) {
  const t = new v(), i = f("div", `ci-before-after-zoom-controls ci-before-after-zoom-controls--${o}`), n = f("button", "ci-before-after-zoom-in", {
    type: "button",
    "aria-label": "Zoom in"
  });
  n.innerHTML = Fe, t.on(n, "click", e.onZoomIn);
  const r = f("button", "ci-before-after-zoom-out", {
    type: "button",
    "aria-label": "Zoom out"
  });
  r.innerHTML = Ye, t.on(r, "click", e.onZoomOut);
  const s = f("button", "ci-before-after-zoom-reset", {
    type: "button",
    "aria-label": "Reset zoom"
  });
  return s.innerHTML = Xe, t.on(s, "click", e.onReset), i.append(n, r, s), { element: i, events: t };
}
class ne {
  constructor(e) {
    this.timeout = null, this.el = f("div", "ci-before-after-scroll-hint", {
      "aria-hidden": "true"
    });
    const t = typeof navigator < "u" && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
    this.el.textContent = t ? "⌘ + scroll or pinch to zoom" : "Ctrl + scroll or pinch to zoom", e.appendChild(this.el);
  }
  show() {
    this.timeout && clearTimeout(this.timeout), this.el.classList.add("ci-before-after-scroll-hint--visible"), this.timeout = setTimeout(() => {
      this.el.classList.remove("ci-before-after-scroll-hint--visible"), this.timeout = null;
    }, 1500);
  }
  destroy() {
    this.timeout && clearTimeout(this.timeout), this.el.remove();
  }
}
function re(o, e, t, i) {
  const n = `ci-before-after-label--${t}`, r = f(
    "div",
    `ci-before-after-label ci-before-after-label-before ${n}`,
    { "aria-hidden": "true" }
  );
  r.textContent = o;
  const s = f(
    "div",
    `ci-before-after-label ci-before-after-label-after ${n}`,
    { "aria-hidden": "true" }
  );
  return s.textContent = e, { before: r, after: s };
}
function se(o, e, t, i) {
  if (!o || !e) return;
  const n = 15;
  t < n ? o.classList.add("ci-before-after-label--hidden") : o.classList.remove("ci-before-after-label--hidden"), t > 100 - n ? e.classList.add("ci-before-after-label--hidden") : e.classList.remove("ci-before-after-label--hidden");
}
const ae = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/></svg>', We = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" x2="21" y1="10" y2="3"/><line x1="3" x2="10" y1="21" y2="14"/></svg>';
class le {
  constructor(e, t) {
    this.container = e, this.onFullscreenChange = t, this.button = null, this.events = new v(), this.isActive = !1, I() && (this.createButton(), this.bindEvents());
  }
  createButton() {
    this.button = f("button", "ci-before-after-fullscreen-btn", {
      type: "button",
      "aria-label": "Enter fullscreen",
      "aria-pressed": "false"
    }), this.button.innerHTML = ae, this.events.on(this.button, "click", () => {
      this.toggle().catch(() => {
      });
    }), this.container.appendChild(this.button);
  }
  bindEvents() {
    this.events.on(document, "fullscreenchange", () => this.handleChange()), this.events.on(document, "webkitfullscreenchange", () => this.handleChange());
  }
  handleChange() {
    var i;
    const e = J(), t = this.isActive;
    this.isActive = e === this.container, t !== this.isActive && (this.container.classList.toggle("ci-before-after-container--fullscreen", this.isActive), this.button && (this.button.innerHTML = this.isActive ? We : ae, this.button.setAttribute("aria-label", this.isActive ? "Exit fullscreen" : "Enter fullscreen"), this.button.setAttribute("aria-pressed", String(this.isActive))), (i = this.onFullscreenChange) == null || i.call(this, this.isActive));
  }
  async enter() {
    I() && await ye(this.container);
  }
  async exit() {
    I() && J() === this.container && await K();
  }
  async toggle() {
    this.isActive ? await this.exit() : await this.enter();
  }
  getIsFullscreen() {
    return this.isActive;
  }
  destroy() {
    var t, i;
    const e = this.isActive;
    this.events.destroy(), e && (this.isActive = !1, (t = this.onFullscreenChange) == null || t.call(this, !1), K().catch(() => {
    })), this.container.classList.remove("ci-before-after-container--fullscreen"), (i = this.button) == null || i.remove();
  }
}
class Ne {
  constructor(e, t, i, n, r, s) {
    this.container = e, this.duration = t, this.delay = i, this.easing = n, this.animateOnce = r, this.onAnimate = s, this.observer = null, this.hasPlayed = !1, this.isAnimating = !1, this.delayTimer = null, this.durationTimer = null, this.observe();
  }
  observe() {
    typeof IntersectionObserver > "u" || (this.observer = new IntersectionObserver(
      (e) => {
        for (const t of e)
          if (t.isIntersecting) {
            if (this.animateOnce && this.hasPlayed || this.isAnimating) continue;
            this.play();
          }
      },
      { threshold: 0.3 }
    ), this.observer.observe(this.container));
  }
  play() {
    var e, t;
    if (this.hasPlayed = !0, this.isAnimating = !0, typeof window < "u" && ((e = window.matchMedia) != null && e.call(window, "(prefers-reduced-motion: reduce)").matches)) {
      this.onAnimate(!0), this.isAnimating = !1, this.animateOnce && ((t = this.observer) == null || t.disconnect());
      return;
    }
    this.container.classList.add("ci-before-after-animate-entrance"), this.container.style.setProperty("--ci-before-after-animate-duration", `${this.duration}ms`), this.container.style.setProperty("--ci-before-after-animate-easing", this.easing), this.delayTimer = setTimeout(() => {
      this.delayTimer = null, this.onAnimate(!1), this.durationTimer = setTimeout(() => {
        var i;
        this.durationTimer = null, this.container.classList.remove("ci-before-after-animate-entrance"), this.isAnimating = !1, this.animateOnce && ((i = this.observer) == null || i.disconnect());
      }, this.duration);
    }, this.delay);
  }
  getHasPlayed() {
    return this.hasPlayed;
  }
  destroy() {
    var e;
    this.delayTimer && clearTimeout(this.delayTimer), this.durationTimer && clearTimeout(this.durationTimer), this.delayTimer = null, this.durationTimer = null, this.isAnimating = !1, this.container.classList.remove("ci-before-after-animate-entrance"), this.container.style.removeProperty("--ci-before-after-animate-duration"), this.container.style.removeProperty("--ci-before-after-animate-easing"), (e = this.observer) == null || e.disconnect(), this.observer = null;
  }
}
class ce {
  constructor(e, t, i, n, r, s) {
    this.handle = e, this.orientation = t, this.step = i, this.largeStep = n, this.zoomEnabled = r, this.callbacks = s, this.events = new v(), this.bind();
  }
  bind() {
    this.events.on(this.handle, "keydown", (e) => {
      this.handleKeyDown(e);
    });
  }
  handleKeyDown(e) {
    var r, s, l, a, c, h;
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    const t = this.callbacks.getPosition(), i = e.shiftKey ? this.largeStep : this.step;
    let n = null;
    if (this.orientation === "horizontal")
      switch (e.key) {
        case "ArrowLeft":
          n = t - i;
          break;
        case "ArrowRight":
          n = t + i;
          break;
      }
    else
      switch (e.key) {
        case "ArrowUp":
          n = t - i;
          break;
        case "ArrowDown":
          n = t + i;
          break;
      }
    switch (e.key) {
      case "Home":
        n = 0;
        break;
      case "End":
        n = 100;
        break;
    }
    if (n !== null) {
      e.preventDefault(), n = Math.max(0, Math.min(100, n)), this.callbacks.onPositionChange(n);
      return;
    }
    if (this.zoomEnabled)
      switch (e.key) {
        case "+":
        case "=":
          e.preventDefault(), (s = (r = this.callbacks).onZoomIn) == null || s.call(r);
          break;
        case "-":
          e.preventDefault(), (a = (l = this.callbacks).onZoomOut) == null || a.call(l);
          break;
        case "0":
          e.preventDefault(), (h = (c = this.callbacks).onZoomReset) == null || h.call(c);
          break;
      }
  }
  updateConfig(e, t, i, n) {
    this.orientation = e, this.step = t, this.largeStep = i, this.zoomEnabled = n;
  }
  destroy() {
    this.events.destroy();
  }
}
function je(o, e) {
  o.setAttribute("aria-valuenow", String(Math.round(e)));
}
function _e(o) {
  o.setAttribute("role", "group"), o.setAttribute("aria-label", "Before and after image comparison");
}
class Ge {
  constructor(e, t) {
    this.events = new v(), this.imageEvents = new v(), this.sliderGestures = null, this.zoomPan = null, this.zoomGestures = null, this.scrollHint = null, this.fullscreenManager = null, this.entranceAnimation = null, this.keyboardHandler = null, this.resizeObserver = null, this.zoomControlsEl = null, this.zoomControlsEvents = null, this.lazyLoadObserver = null, this.resizeDebounceTimer = null, this.animTransitionTimer = null, this.suppressCallbacks = !1;
    const i = ze(e);
    this.userConfig = { ...t }, this.config = V(t), this.state = {
      position: this.config.initialPosition,
      isDragging: !1,
      zoomLevel: 1,
      panX: 0,
      panY: 0,
      isReady: !1,
      isFullscreen: !1
    }, this.buildDOM(i), this.initModules(), this.loadImages();
  }
  // --- Public API ---
  getElements() {
    return {
      container: this.elements.container,
      viewport: this.elements.viewport,
      beforeImage: this.elements.beforeImage,
      afterImage: this.elements.afterImage,
      handle: this.elements.handle
    };
  }
  setPosition(e) {
    const t = Q(e);
    this.updatePosition(t);
  }
  getPosition() {
    return this.state.position;
  }
  setZoom(e) {
    var t;
    (t = this.zoomPan) == null || t.setZoom(e);
  }
  getZoom() {
    var e;
    return ((e = this.zoomPan) == null ? void 0 : e.getZoom()) ?? 1;
  }
  resetZoom() {
    var e;
    (e = this.zoomPan) == null || e.resetZoom();
  }
  enterFullscreen() {
    var e;
    (e = this.fullscreenManager) == null || e.enter().catch(() => {
    });
  }
  exitFullscreen() {
    var e;
    (e = this.fullscreenManager) == null || e.exit().catch(() => {
    });
  }
  isFullscreen() {
    var e;
    return ((e = this.fullscreenManager) == null ? void 0 : e.getIsFullscreen()) ?? !1;
  }
  update(e) {
    var s, l, a, c, h, m, b, p;
    this.userConfig = { ...this.userConfig, ...e };
    const t = this.config;
    this.config = V(this.userConfig);
    const i = this.config.beforeSrc !== t.beforeSrc, n = this.config.afterSrc !== t.afterSrc, r = !Ve(this.config.cloudimage, t.cloudimage);
    if ((i || n || r) && (this.lazyLoadObserver && (this.lazyLoadObserver.disconnect(), this.lazyLoadObserver = null), this.state.isReady = !1, this.elements.container.classList.add("ci-before-after-loading"), (i || r) && (this.elements.beforeImage.src = this.resolveImageSrc(this.config.beforeSrc)), (n || r) && (this.elements.afterImage.src = this.resolveImageSrc(this.config.afterSrc)), this.registerImageLoadHandlers(i || r, n || r), this.config.cloudimage && !t.cloudimage ? this.initResizeObserver() : !this.config.cloudimage && t.cloudimage && ((s = this.resizeObserver) == null || s.disconnect(), this.resizeObserver = null)), this.config.beforeAlt !== t.beforeAlt && this.elements.beforeImage.setAttribute("alt", this.config.beforeAlt), this.config.afterAlt !== t.afterAlt && this.elements.afterImage.setAttribute("alt", this.config.afterAlt), this.config.aspectRatio !== t.aspectRatio && (this.elements.wrapper.style.aspectRatio = this.config.aspectRatio || ""), this.elements.container.classList.toggle("ci-before-after-theme-dark", this.config.theme === "dark"), this.elements.container.classList.toggle("ci-before-after-container--horizontal", this.config.orientation === "horizontal"), this.elements.container.classList.toggle("ci-before-after-container--vertical", this.config.orientation === "vertical"), this.elements.container.classList.toggle("ci-before-after-container--hover-mode", this.config.mode === "hover"), this.elements.container.classList.toggle("ci-before-after-container--click-mode", this.config.mode === "click"), this.elements.viewport.classList.toggle("ci-before-after-viewport--zoomable", this.config.zoom), (this.config.handleStyle !== t.handleStyle || this.config.orientation !== t.orientation) && this.rebuildHandle(), this.config.mode !== t.mode && ((l = this.sliderGestures) == null || l.updateMode(this.config.mode)), this.config.orientation !== t.orientation && ((a = this.sliderGestures) == null || a.updateOrientation(this.config.orientation)), (this.config.labelsEnabled !== t.labelsEnabled || this.config.labelBefore !== t.labelBefore || this.config.labelAfter !== t.labelAfter || this.config.labelPosition !== t.labelPosition || this.config.orientation !== t.orientation) && this.rebuildLabels(), this.config.zoom !== t.zoom)
      this.rebuildZoom();
    else if (this.zoomPan && (this.zoomPan.updateConfig(this.config), this.config.scrollHint !== t.scrollHint && ((c = this.scrollHint) == null || c.destroy(), this.scrollHint = null, this.config.scrollHint && (this.scrollHint = new ne(this.elements.container))), (this.config.zoomControls !== t.zoomControls || this.config.zoomControlsPosition !== t.zoomControlsPosition) && ((h = this.zoomControlsEvents) == null || h.destroy(), this.zoomControlsEvents = null, (m = this.zoomControlsEl) == null || m.remove(), this.zoomControlsEl = null, this.elements.container.classList.remove("ci-before-after-container--zoom-top-right"), this.elements.container.classList.remove("ci-before-after-container--zoom-top"), this.elements.container.classList.remove("ci-before-after-container--zoom-left"), this.config.zoomControls))) {
      const g = oe(
        this.config.zoomControlsPosition,
        {
          onZoomIn: () => {
            var u;
            return (u = this.zoomPan) == null ? void 0 : u.zoomIn();
          },
          onZoomOut: () => {
            var u;
            return (u = this.zoomPan) == null ? void 0 : u.zoomOut();
          },
          onReset: () => {
            var u;
            return (u = this.zoomPan) == null ? void 0 : u.resetZoom();
          }
        }
      );
      this.zoomControlsEl = g.element, this.zoomControlsEvents = g.events, this.elements.container.appendChild(this.zoomControlsEl), this.applyZoomPositionClasses();
    }
    this.config.initialPosition !== t.initialPosition && this.updatePosition(this.config.initialPosition), this.config.fullscreenButton !== t.fullscreenButton && this.rebuildFullscreen(), this.config.animateEnabled !== t.animateEnabled && ((b = this.entranceAnimation) == null || b.destroy(), this.entranceAnimation = null, this.config.animateEnabled && this.initEntranceAnimation()), (p = this.keyboardHandler) == null || p.updateConfig(
      this.config.orientation,
      this.config.keyboardStep,
      this.config.keyboardLargeStep,
      this.config.zoom
    ), this.updatePosition(this.state.position);
  }
  destroy() {
    var e, t, i, n, r, s, l, a, c, h, m;
    (e = this.sliderGestures) == null || e.destroy(), (t = this.zoomGestures) == null || t.destroy(), (i = this.zoomPan) == null || i.destroy(), this.zoomPan = null, (n = this.scrollHint) == null || n.destroy(), (r = this.fullscreenManager) == null || r.destroy(), (s = this.entranceAnimation) == null || s.destroy(), (l = this.keyboardHandler) == null || l.destroy(), this.events.destroy(), this.imageEvents.destroy(), (a = this.resizeObserver) == null || a.disconnect(), (c = this.lazyLoadObserver) == null || c.disconnect(), this.lazyLoadObserver = null, (h = this.zoomControlsEvents) == null || h.destroy(), this.zoomControlsEvents = null, (m = this.zoomControlsEl) == null || m.remove(), this.resizeDebounceTimer && clearTimeout(this.resizeDebounceTimer), this.animTransitionTimer && clearTimeout(this.animTransitionTimer), this.elements.container.innerHTML = "", this.elements.container.removeAttribute("role"), this.elements.container.removeAttribute("aria-label"), this.elements.container.className = this.elements.container.className.split(" ").filter((b) => !b.startsWith("ci-before-after")).join(" ");
  }
  // --- Private Methods ---
  buildDOM(e) {
    e.innerHTML = "";
    const t = `ci-before-after-container--${this.config.orientation}`;
    e.classList.add("ci-before-after-container", t), this.config.mode === "hover" && e.classList.add("ci-before-after-container--hover-mode"), this.config.mode === "click" && e.classList.add("ci-before-after-container--click-mode"), this.config.theme === "dark" && e.classList.add("ci-before-after-theme-dark"), e.classList.add("ci-before-after-loading"), _e(e);
    const i = f("div", "ci-before-after-viewport");
    this.config.zoom && i.classList.add("ci-before-after-viewport--zoomable");
    const n = f("div", "ci-before-after-wrapper");
    this.config.aspectRatio && (n.style.aspectRatio = this.config.aspectRatio);
    const r = f("img", "ci-before-after-image ci-before-after-before", {
      alt: this.config.beforeAlt,
      draggable: "false",
      role: "img"
    }), s = f("div", "ci-before-after-clip");
    M(s, this.state.position, this.config.orientation);
    const l = f("img", "ci-before-after-image ci-before-after-after", {
      alt: this.config.afterAlt,
      draggable: "false",
      role: "img"
    });
    s.appendChild(l), n.append(r, s), i.appendChild(n), e.appendChild(i);
    const a = ee(this.config.handleStyle, this.config.orientation, this.state.position);
    e.appendChild(a);
    const c = a.querySelector(".ci-before-after-handle-grip");
    let h = null, m = null;
    if (this.config.labelsEnabled) {
      const b = re(
        this.config.labelBefore,
        this.config.labelAfter,
        this.config.labelPosition,
        this.config.orientation
      );
      h = b.before, m = b.after, e.append(h, m);
    }
    this.elements = {
      container: e,
      viewport: i,
      wrapper: n,
      beforeImage: r,
      afterImage: l,
      clip: s,
      handle: a,
      handleGrip: c,
      labelBefore: h,
      labelAfter: m
    };
  }
  initModules() {
    this.sliderGestures = new te(
      this.elements.container,
      this.elements.handle,
      this.config.mode,
      this.config.orientation,
      {
        onPositionChange: (e) => this.updatePosition(e),
        onDragStart: () => this.onDragStart(),
        onDragEnd: () => this.onDragEnd()
      }
    ), this.keyboardHandler = new ce(
      this.elements.handle,
      this.config.orientation,
      this.config.keyboardStep,
      this.config.keyboardLargeStep,
      this.config.zoom,
      {
        onPositionChange: (e) => this.updatePosition(e),
        getPosition: () => this.state.position,
        onZoomIn: () => {
          var e;
          return (e = this.zoomPan) == null ? void 0 : e.zoomIn();
        },
        onZoomOut: () => {
          var e;
          return (e = this.zoomPan) == null ? void 0 : e.zoomOut();
        },
        onZoomReset: () => {
          var e;
          return (e = this.zoomPan) == null ? void 0 : e.resetZoom();
        }
      }
    ), this.config.zoom && this.initZoom(), this.config.fullscreenButton && (this.elements.container.classList.add("ci-before-after-container--has-fullscreen"), this.fullscreenManager = new le(
      this.elements.container,
      (e) => {
        this.state.isFullscreen = e, L(this.config.onFullscreenChange, e);
      }
    )), this.config.animateEnabled && this.initEntranceAnimation(), this.config.cloudimage && this.initResizeObserver();
  }
  initZoom() {
    if (this.zoomPan = new Be(
      this.elements.viewport,
      this.elements.container,
      this.config,
      (e) => {
        this.state.zoomLevel = e, this.syncClip(), L(this.config.onZoom, e);
      },
      () => this.syncClip()
    ), this.config.scrollHint && (this.scrollHint = new ne(this.elements.container)), this.zoomGestures = new ie(
      this.elements.container,
      this.elements.handle,
      this.zoomPan,
      () => {
        var e;
        return (e = this.scrollHint) == null ? void 0 : e.show();
      }
    ), this.config.zoomControls) {
      const e = oe(
        this.config.zoomControlsPosition,
        {
          onZoomIn: () => {
            var t;
            return (t = this.zoomPan) == null ? void 0 : t.zoomIn();
          },
          onZoomOut: () => {
            var t;
            return (t = this.zoomPan) == null ? void 0 : t.zoomOut();
          },
          onReset: () => {
            var t;
            return (t = this.zoomPan) == null ? void 0 : t.resetZoom();
          }
        }
      );
      this.zoomControlsEl = e.element, this.zoomControlsEvents = e.events, this.elements.container.appendChild(this.zoomControlsEl), this.applyZoomPositionClasses();
    }
  }
  applyZoomPositionClasses() {
    const e = this.config.zoomControlsPosition;
    this.elements.container.classList.toggle("ci-before-after-container--zoom-top-right", e === "top-right"), this.elements.container.classList.toggle("ci-before-after-container--zoom-top", e.startsWith("top-")), this.elements.container.classList.toggle("ci-before-after-container--zoom-left", e.endsWith("-left"));
  }
  initEntranceAnimation() {
    this.animTransitionTimer && (clearTimeout(this.animTransitionTimer), this.animTransitionTimer = null, this.elements.handle.style.transition = "", this.elements.clip.style.transition = "");
    const e = 0;
    this.suppressCallbacks = !0, this.updatePosition(e), this.suppressCallbacks = !1, this.entranceAnimation = new Ne(
      this.elements.container,
      this.config.animateDuration,
      this.config.animateDelay,
      this.config.animateEasing,
      this.config.animateOnce,
      (t) => {
        t || (this.elements.handle.style.transition = `left ${this.config.animateDuration}ms ${this.config.animateEasing}, top ${this.config.animateDuration}ms ${this.config.animateEasing}`, this.elements.clip.style.transition = `clip-path ${this.config.animateDuration}ms ${this.config.animateEasing}`), this.updatePosition(this.config.initialPosition), t || (this.animTransitionTimer = setTimeout(() => {
          this.animTransitionTimer = null, this.elements.handle.style.transition = "", this.elements.clip.style.transition = "";
        }, this.config.animateDuration));
      }
    );
  }
  loadImages() {
    const e = this.resolveImageSrc(this.config.beforeSrc), t = this.resolveImageSrc(this.config.afterSrc);
    this.config.lazyLoad && typeof IntersectionObserver < "u" ? (this.lazyLoadObserver = new IntersectionObserver(
      (i) => {
        var n;
        for (const r of i)
          r.isIntersecting && (this.elements.beforeImage.src = e, this.elements.afterImage.src = t, (n = this.lazyLoadObserver) == null || n.disconnect(), this.lazyLoadObserver = null);
      },
      { threshold: 0 }
    ), this.lazyLoadObserver.observe(this.elements.container)) : (this.elements.beforeImage.src = e, this.elements.afterImage.src = t), this.registerImageLoadHandlers(!0, !0);
  }
  /**
   * Register load/error handlers for images. Cleans up previous handlers first.
   * When only one image changed, the unchanged image is treated as already loaded.
   */
  registerImageLoadHandlers(e, t) {
    this.imageEvents.destroy();
    let i = !e, n = !t;
    const r = () => {
      i && n && this.onImagesReady();
    }, s = () => {
      i || (i = !0, r());
    }, l = () => {
      n || (n = !0, r());
    }, a = () => {
      console.warn(`CIBeforeAfter: Failed to load image "${this.elements.beforeImage.src}"`), i || (i = !0, r());
    }, c = () => {
      console.warn(`CIBeforeAfter: Failed to load image "${this.elements.afterImage.src}"`), n || (n = !0, r());
    };
    this.imageEvents.on(this.elements.beforeImage, "load", s), this.imageEvents.on(this.elements.afterImage, "load", l), this.imageEvents.on(this.elements.beforeImage, "error", a), this.imageEvents.on(this.elements.afterImage, "error", c), this.elements.beforeImage.complete && this.elements.beforeImage.src && s(), this.elements.afterImage.complete && this.elements.afterImage.src && l();
  }
  onImagesReady() {
    if (this.state.isReady) return;
    this.state.isReady = !0;
    const { naturalWidth: e, naturalHeight: t } = this.elements.beforeImage;
    e && t && (this.elements.wrapper.style.aspectRatio = `${e} / ${t}`), this.elements.container.classList.remove("ci-before-after-loading"), L(this.config.onReady);
  }
  getClipZoomInfo() {
    if (!this.zoomPan || this.zoomPan.getZoom() <= 1) return;
    const e = this.zoomPan.getPan(), t = this.zoomPan.getContainerSize();
    return {
      level: this.zoomPan.getZoom(),
      panX: e.x,
      panY: e.y,
      containerWidth: t.width,
      containerHeight: t.height
    };
  }
  syncClip() {
    M(this.elements.clip, this.state.position, this.config.orientation, this.getClipZoomInfo());
  }
  updatePosition(e) {
    this.state.position = Q(e), M(this.elements.clip, this.state.position, this.config.orientation, this.getClipZoomInfo()), Ae(this.elements.handle, this.state.position, this.config.orientation), je(this.elements.handle, this.state.position), se(
      this.elements.labelBefore,
      this.elements.labelAfter,
      this.state.position,
      this.config.orientation
    ), this.suppressCallbacks || L(this.config.onSlide, this.state.position);
  }
  onDragStart() {
    this.state.isDragging = !0, this.elements.container.classList.add("ci-before-after-container--dragging");
  }
  onDragEnd() {
    this.state.isDragging = !1, this.elements.container.classList.remove("ci-before-after-container--dragging");
  }
  resolveImageSrc(e) {
    if (this.config.cloudimage) {
      const t = this.elements.container.getBoundingClientRect().width || 800;
      return Ee(e, t, this.config.cloudimage);
    }
    return e;
  }
  rebuildHandle() {
    var i, n;
    const e = document.activeElement === this.elements.handle;
    this.elements.handle.remove();
    const t = ee(this.config.handleStyle, this.config.orientation, this.state.position);
    this.elements.container.appendChild(t), this.elements.handle = t, this.elements.handleGrip = t.querySelector(".ci-before-after-handle-grip"), (i = this.sliderGestures) == null || i.destroy(), this.sliderGestures = new te(
      this.elements.container,
      this.elements.handle,
      this.config.mode,
      this.config.orientation,
      {
        onPositionChange: (r) => this.updatePosition(r),
        onDragStart: () => this.onDragStart(),
        onDragEnd: () => this.onDragEnd()
      }
    ), (n = this.keyboardHandler) == null || n.destroy(), this.keyboardHandler = new ce(
      this.elements.handle,
      this.config.orientation,
      this.config.keyboardStep,
      this.config.keyboardLargeStep,
      this.config.zoom,
      {
        onPositionChange: (r) => this.updatePosition(r),
        getPosition: () => this.state.position,
        onZoomIn: () => {
          var r;
          return (r = this.zoomPan) == null ? void 0 : r.zoomIn();
        },
        onZoomOut: () => {
          var r;
          return (r = this.zoomPan) == null ? void 0 : r.zoomOut();
        },
        onZoomReset: () => {
          var r;
          return (r = this.zoomPan) == null ? void 0 : r.resetZoom();
        }
      }
    ), this.zoomGestures && this.zoomPan && (this.zoomGestures.destroy(), this.zoomGestures = new ie(
      this.elements.container,
      this.elements.handle,
      this.zoomPan,
      () => {
        var r;
        return (r = this.scrollHint) == null ? void 0 : r.show();
      }
    )), e && this.elements.handle.focus();
  }
  rebuildLabels() {
    var e, t;
    if ((e = this.elements.labelBefore) == null || e.remove(), (t = this.elements.labelAfter) == null || t.remove(), this.elements.labelBefore = null, this.elements.labelAfter = null, this.config.labelsEnabled) {
      const i = re(
        this.config.labelBefore,
        this.config.labelAfter,
        this.config.labelPosition,
        this.config.orientation
      );
      this.elements.labelBefore = i.before, this.elements.labelAfter = i.after, this.elements.container.append(i.before, i.after), se(i.before, i.after, this.state.position, this.config.orientation);
    }
  }
  rebuildZoom() {
    var e, t, i, n, r;
    (e = this.zoomGestures) == null || e.destroy(), this.zoomGestures = null, (t = this.scrollHint) == null || t.destroy(), this.scrollHint = null, (i = this.zoomControlsEvents) == null || i.destroy(), this.zoomControlsEvents = null, (n = this.zoomControlsEl) == null || n.remove(), this.zoomControlsEl = null, (r = this.zoomPan) == null || r.destroy(), this.zoomPan = null, this.elements.container.classList.remove("ci-before-after-container--zoom-top-right"), this.elements.container.classList.remove("ci-before-after-container--zoom-top"), this.elements.container.classList.remove("ci-before-after-container--zoom-left"), this.config.zoom && this.initZoom();
  }
  rebuildFullscreen() {
    var e;
    (e = this.fullscreenManager) == null || e.destroy(), this.fullscreenManager = null, this.elements.container.classList.remove("ci-before-after-container--has-fullscreen"), this.config.fullscreenButton && (this.elements.container.classList.add("ci-before-after-container--has-fullscreen"), this.fullscreenManager = new le(
      this.elements.container,
      (t) => {
        this.state.isFullscreen = t, L(this.config.onFullscreenChange, t);
      }
    ));
  }
  initResizeObserver() {
    typeof ResizeObserver > "u" || (this.resizeObserver = new ResizeObserver(() => {
      this.resizeDebounceTimer && clearTimeout(this.resizeDebounceTimer), this.resizeDebounceTimer = setTimeout(() => {
        if (this.config.cloudimage) {
          const e = this.resolveImageSrc(this.config.beforeSrc), t = this.resolveImageSrc(this.config.afterSrc);
          this.elements.beforeImage.src !== e && (this.elements.beforeImage.src = e), this.elements.afterImage.src !== t && (this.elements.afterImage.src = t);
        }
        this.resizeDebounceTimer = null;
      }, 200);
    }), this.resizeObserver.observe(this.elements.container));
  }
}
function L(o, ...e) {
  if (o)
    try {
      o(...e);
    } catch (t) {
      console.error("CIBeforeAfter: callback error:", t);
    }
}
function Ve(o, e) {
  if (o === e) return !0;
  if (!o || !e) return !1;
  const t = Object.keys(o), i = Object.keys(e);
  if (t.length !== i.length) return !1;
  for (const n of t)
    if (o[n] !== e[n]) return !1;
  return !0;
}
const he = ".ci-before-after-container{--ci-before-after-handle-width: 4px;--ci-before-after-handle-color: #ffffff;--ci-before-after-handle-shadow: 0 0 8px rgba(0, 0, 0, .3);--ci-before-after-grip-size: 44px;--ci-before-after-grip-bg: #ffffff;--ci-before-after-grip-border: 2px solid rgba(0, 0, 0, .1);--ci-before-after-grip-border-radius: 50%;--ci-before-after-grip-shadow: 0 2px 8px rgba(0, 0, 0, .2);--ci-before-after-grip-icon-color: #333333;--ci-before-after-grip-icon-size: 20px;--ci-before-after-grip-hover-bg: #f0f0f0;--ci-before-after-grip-hover-shadow: 0 4px 16px rgba(0, 0, 0, .25);--ci-before-after-grip-active-bg: #e0e0e0;--ci-before-after-grip-active-scale: .95;--ci-before-after-label-font-family: inherit;--ci-before-after-label-font-size: 14px;--ci-before-after-label-font-weight: 600;--ci-before-after-label-color: #ffffff;--ci-before-after-label-bg: rgba(0, 0, 0, .5);--ci-before-after-label-padding: 6px 14px;--ci-before-after-label-border-radius: 6px;--ci-before-after-label-offset-x: 12px;--ci-before-after-label-offset-y: 12px;--ci-before-after-label-backdrop-filter: blur(4px);--ci-before-after-handle-transition: .15s ease;--ci-before-after-slide-transition: 0ms;--ci-before-after-animate-duration: .8s;--ci-before-after-animate-easing: ease-out;--ci-before-after-zoom-controls-bg: rgba(255, 255, 255, .9);--ci-before-after-zoom-controls-color: #333333;--ci-before-after-zoom-controls-border-radius: 8px;--ci-before-after-zoom-controls-shadow: 0 2px 8px rgba(0, 0, 0, .15)}.ci-before-after-theme-dark{--ci-before-after-handle-color: #1a1a1a;--ci-before-after-handle-shadow: 0 0 8px rgba(255, 255, 255, .2);--ci-before-after-grip-bg: #1a1a1a;--ci-before-after-grip-border: 2px solid rgba(255, 255, 255, .2);--ci-before-after-grip-shadow: 0 2px 8px rgba(0, 0, 0, .5);--ci-before-after-grip-icon-color: #f0f0f0;--ci-before-after-grip-hover-bg: #2a2a2a;--ci-before-after-grip-active-bg: #333333;--ci-before-after-label-bg: rgba(0, 0, 0, .45);--ci-before-after-label-color: #f0f0f0;--ci-before-after-zoom-controls-bg: rgba(30, 30, 30, .9);--ci-before-after-zoom-controls-color: #f0f0f0}.ci-before-after-container{position:relative;overflow:hidden;width:100%;border-radius:var(--ci-before-after-border-radius, 0px);box-shadow:var(--ci-before-after-shadow, none);user-select:none;-webkit-user-select:none;touch-action:pan-y;line-height:0}.ci-before-after-container--vertical{touch-action:pan-x}.ci-before-after-container--fullscreen{background:#000;display:flex;align-items:center;justify-content:center;width:100vw;height:100vh}.ci-before-after-container--fullscreen .ci-before-after-wrapper{max-height:100vh}.ci-before-after-container--fullscreen .ci-before-after-image{object-fit:contain}.ci-before-after-container--dragging{cursor:ew-resize}.ci-before-after-container--vertical.ci-before-after-container--dragging{cursor:ns-resize}.ci-before-after-viewport{position:relative;width:100%;height:100%;transform-origin:0 0}.ci-before-after-viewport--zoomable{will-change:transform}.ci-before-after-wrapper{position:relative;width:100%;overflow:hidden}.ci-before-after-image{display:block;width:100%;height:100%;object-fit:cover}.ci-before-after-before{display:block;width:100%}.ci-before-after-after{position:absolute;top:0;left:0;width:100%;height:100%}.ci-before-after-clip{position:absolute;top:0;left:0;right:0;bottom:0}.ci-before-after-handle{position:absolute;top:0;bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:10;transform:translate(-50%);cursor:ew-resize;outline:none}.ci-before-after-handle:focus-visible .ci-before-after-handle-grip{outline:3px solid #4d90fe;outline-offset:2px}.ci-before-after-container--vertical .ci-before-after-handle{top:auto;bottom:auto;left:0;right:0;flex-direction:row;transform:translateY(-50%);cursor:ns-resize}.ci-before-after-handle-line{flex:1;width:var(--ci-before-after-handle-width);background:var(--ci-before-after-handle-color);box-shadow:var(--ci-before-after-handle-shadow)}.ci-before-after-container--vertical .ci-before-after-handle-line{width:auto;height:var(--ci-before-after-handle-width);flex:1}.ci-before-after-handle-grip{display:flex;align-items:center;justify-content:center;width:var(--ci-before-after-grip-size);height:var(--ci-before-after-grip-size);background:var(--ci-before-after-grip-bg);border:var(--ci-before-after-grip-border);border-radius:var(--ci-before-after-grip-border-radius);box-shadow:var(--ci-before-after-grip-shadow);color:var(--ci-before-after-grip-icon-color);flex-shrink:0;transition:background .15s ease,box-shadow .15s ease,transform .15s ease}.ci-before-after-handle-grip svg{width:var(--ci-before-after-grip-icon-size);height:var(--ci-before-after-grip-icon-size)}.ci-before-after-handle-grip:hover,.ci-before-after-handle:hover .ci-before-after-handle-grip{background:var(--ci-before-after-grip-hover-bg);box-shadow:var(--ci-before-after-grip-hover-shadow);transform:scale(1.1)}.ci-before-after-container--dragging .ci-before-after-handle-grip{background:var(--ci-before-after-grip-active-bg);transform:scale(var(--ci-before-after-grip-active-scale))}.ci-before-after-handle--line .ci-before-after-handle-grip,.ci-before-after-handle--line .ci-before-after-handle-grip--pill{width:8px;height:32px;border-radius:4px}.ci-before-after-container--vertical .ci-before-after-handle--line .ci-before-after-handle-grip{width:32px;height:8px}.ci-before-after-handle--circle .ci-before-after-handle-line{display:none}.ci-before-after-label{position:absolute;z-index:5;font-family:var(--ci-before-after-label-font-family);font-size:var(--ci-before-after-label-font-size);font-weight:var(--ci-before-after-label-font-weight);color:var(--ci-before-after-label-color);background:var(--ci-before-after-label-bg);padding:var(--ci-before-after-label-padding);border-radius:var(--ci-before-after-label-border-radius);backdrop-filter:var(--ci-before-after-label-backdrop-filter);-webkit-backdrop-filter:var(--ci-before-after-label-backdrop-filter);pointer-events:none;line-height:1.2;transition:opacity .2s ease;opacity:1}.ci-before-after-label--hidden{opacity:0}.ci-before-after-container--horizontal .ci-before-after-label--top.ci-before-after-label-before{top:var(--ci-before-after-label-offset-y);left:25%;transform:translate(-50%)}.ci-before-after-container--horizontal .ci-before-after-label--top.ci-before-after-label-after{top:var(--ci-before-after-label-offset-y);left:75%;transform:translate(-50%)}.ci-before-after-container--horizontal .ci-before-after-label--bottom.ci-before-after-label-before{bottom:var(--ci-before-after-label-offset-y);left:25%;transform:translate(-50%)}.ci-before-after-container--horizontal .ci-before-after-label--bottom.ci-before-after-label-after{bottom:var(--ci-before-after-label-offset-y);left:75%;transform:translate(-50%)}.ci-before-after-container--vertical .ci-before-after-label--top.ci-before-after-label-before{top:var(--ci-before-after-label-offset-y);left:var(--ci-before-after-label-offset-x)}.ci-before-after-container--vertical .ci-before-after-label--top.ci-before-after-label-after{bottom:var(--ci-before-after-label-offset-y);left:var(--ci-before-after-label-offset-x)}.ci-before-after-container--vertical .ci-before-after-label--bottom.ci-before-after-label-before{top:var(--ci-before-after-label-offset-y);right:var(--ci-before-after-label-offset-x)}.ci-before-after-container--vertical .ci-before-after-label--bottom.ci-before-after-label-after{bottom:var(--ci-before-after-label-offset-y);right:var(--ci-before-after-label-offset-x)}.ci-before-after-container--vertical.ci-before-after-container--zoom-left .ci-before-after-label--top.ci-before-after-label-before,.ci-before-after-container--vertical.ci-before-after-container--zoom-left .ci-before-after-label--top.ci-before-after-label-after{left:calc(var(--ci-before-after-label-offset-x) + 44px)}.ci-before-after-zoom-controls{position:absolute;z-index:20;display:flex;gap:2px;background:var(--ci-before-after-zoom-controls-bg);border-radius:var(--ci-before-after-zoom-controls-border-radius);box-shadow:var(--ci-before-after-zoom-controls-shadow);padding:0;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}.ci-before-after-zoom-controls button{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:none;background:transparent;color:var(--ci-before-after-zoom-controls-color);cursor:pointer;border-radius:6px;padding:0;transition:background .15s ease}.ci-before-after-zoom-controls button:hover{background:#00000014}.ci-before-after-theme-dark .ci-before-after-zoom-controls button:hover{background:#ffffff1f}.ci-before-after-zoom-controls button:focus-visible{outline:2px solid #4d90fe;outline-offset:-2px}.ci-before-after-zoom-controls--top-left{top:12px;left:12px}.ci-before-after-zoom-controls--top-center{top:12px;left:50%;transform:translate(-50%)}.ci-before-after-zoom-controls--top-right{top:12px;right:12px}.ci-before-after-zoom-controls--bottom-left{bottom:12px;left:12px}.ci-before-after-zoom-controls--bottom-center{bottom:12px;left:50%;transform:translate(-50%)}.ci-before-after-zoom-controls--bottom-right{bottom:12px;right:12px}.ci-before-after-fullscreen-btn{position:absolute;top:12px;right:12px;z-index:20;display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:none;background:var(--ci-before-after-zoom-controls-bg);color:var(--ci-before-after-zoom-controls-color);border-radius:8px;cursor:pointer;box-shadow:var(--ci-before-after-zoom-controls-shadow);padding:0;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);transition:background .15s ease}.ci-before-after-fullscreen-btn:hover{background:#e6e6e6f2}.ci-before-after-theme-dark .ci-before-after-fullscreen-btn:hover{background:#323232f2}.ci-before-after-fullscreen-btn:focus-visible{outline:2px solid #4d90fe;outline-offset:2px}.ci-before-after-container--zoom-top-right .ci-before-after-fullscreen-btn{right:132px}.ci-before-after-container--zoom-top.ci-before-after-container--horizontal .ci-before-after-label--top{top:auto;bottom:var(--ci-before-after-label-offset-y)}.ci-before-after-scroll-hint{position:absolute;bottom:50%;left:50%;transform:translate(-50%,50%);z-index:30;background:#000000bf;color:#fff;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:500;white-space:nowrap;pointer-events:none;opacity:0;transition:opacity .2s ease;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);line-height:1.4}.ci-before-after-scroll-hint--visible{opacity:1}.ci-before-after-loading .ci-before-after-wrapper{aspect-ratio:var(--ci-before-after-aspect-ratio, auto);min-height:200px;background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0,#f0f0f0 75%);background-size:200% 100%;animation:ci-before-after-shimmer 1.5s infinite}.ci-before-after-theme-dark.ci-before-after-loading .ci-before-after-wrapper{background:linear-gradient(90deg,#2a2a2a 25%,#333,#2a2a2a 75%);background-size:200% 100%}@keyframes ci-before-after-shimmer{0%{background-position:-200% 0}to{background-position:200% 0}}.ci-before-after-container--hover-mode{cursor:ew-resize}.ci-before-after-container--vertical.ci-before-after-container--hover-mode{cursor:ns-resize}.ci-before-after-container--click-mode{cursor:pointer}@media(prefers-reduced-motion:reduce){.ci-before-after-container,.ci-before-after-container *{animation:none!important;transition-duration:.01ms!important}}";
class pe extends Ge {
  static autoInit(e) {
    if (!S()) return [];
    q(he);
    const i = (e || document).querySelectorAll("[data-ci-before-after-before-src]"), n = [];
    return i.forEach((r) => {
      const s = ve(r);
      n.push(new pe(r, s));
    }), n;
  }
  constructor(e, t) {
    q(he), super(e, t);
  }
}
export {
  pe as CIBeforeAfter,
  Ge as CIBeforeAfterCore,
  pe as default
};
//# sourceMappingURL=js-cloudimage-before-after.esm.js.map
