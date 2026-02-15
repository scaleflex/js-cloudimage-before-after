import { jsx as S } from "react/jsx-runtime";
import { forwardRef as P, useRef as c, useImperativeHandle as h, useEffect as p } from "react";
const F = P(
  function(s, u) {
    const {
      className: a,
      style: m,
      onSlide: l,
      onZoom: i,
      onFullscreenChange: y,
      onReady: z,
      ...t
    } = s, d = c(null), n = c(null), f = c(null);
    return h(u, () => ({
      getElements: () => {
        if (!n.current) throw new Error("CIBeforeAfter: instance not yet initialized");
        return n.current.getElements();
      },
      setPosition: (r) => {
        var o;
        return (o = n.current) == null ? void 0 : o.setPosition(r);
      },
      getPosition: () => {
        var r;
        return ((r = n.current) == null ? void 0 : r.getPosition()) ?? 50;
      },
      setZoom: (r) => {
        var o;
        return (o = n.current) == null ? void 0 : o.setZoom(r);
      },
      getZoom: () => {
        var r;
        return ((r = n.current) == null ? void 0 : r.getZoom()) ?? 1;
      },
      resetZoom: () => {
        var r;
        return (r = n.current) == null ? void 0 : r.resetZoom();
      },
      enterFullscreen: () => {
        var r;
        return (r = n.current) == null ? void 0 : r.enterFullscreen();
      },
      exitFullscreen: () => {
        var r;
        return (r = n.current) == null ? void 0 : r.exitFullscreen();
      },
      isFullscreen: () => {
        var r;
        return ((r = n.current) == null ? void 0 : r.isFullscreen()) ?? !1;
      },
      update: (r) => {
        var o;
        return (o = n.current) == null ? void 0 : o.update(r);
      },
      destroy: () => {
        var r;
        return (r = n.current) == null ? void 0 : r.destroy();
      }
    })), p(() => {
      if (!d.current) return;
      let r = !1, o = null;
      return import("./js-cloudimage-before-after").then(
        ({ CIBeforeAfterCore: b }) => {
          if (r || !d.current) return;
          const C = {
            ...t,
            onSlide: l,
            onZoom: i,
            onFullscreenChange: y,
            onReady: z
          };
          o = new b(d.current, C), n.current = o, f.current && (o.update(f.current), f.current = null);
        },
        () => {
        }
      ), () => {
        r = !0, o == null || o.destroy(), n.current = null;
      };
    }, []), p(() => {
      const r = {
        ...t,
        onSlide: l,
        onZoom: i,
        onFullscreenChange: y,
        onReady: z
      };
      if (!n.current) {
        f.current = r;
        return;
      }
      n.current.update(r);
    }, [
      t.beforeSrc,
      t.afterSrc,
      t.beforeAlt,
      t.afterAlt,
      t.mode,
      t.orientation,
      t.initialPosition,
      t.zoom,
      t.zoomMax,
      t.zoomMin,
      t.theme,
      t.handleStyle,
      t.labels,
      t.labelPosition,
      t.fullscreenButton,
      t.lazyLoad,
      t.zoomControls,
      t.zoomControlsPosition,
      t.scrollHint,
      t.keyboardStep,
      t.keyboardLargeStep,
      t.animate,
      t.animateOnce,
      t.cloudimage,
      l,
      i,
      y,
      z
    ]), /* @__PURE__ */ S("div", { ref: d, className: a, style: m });
  }
);
function Z(e) {
  const s = c(null), u = c(null), a = c(null);
  return p(() => {
    if (!s.current) return;
    let m = !1, l = null;
    return import("./js-cloudimage-before-after").then(
      ({ CIBeforeAfterCore: i }) => {
        m || !s.current || (l = new i(s.current, e), u.current = l, a.current && (l.update(a.current), a.current = null));
      },
      () => {
      }
    ), () => {
      m = !0, l == null || l.destroy(), u.current = null;
    };
  }, []), p(() => {
    if (!u.current) {
      a.current = e;
      return;
    }
    u.current.update(e);
  }, [
    e.beforeSrc,
    e.afterSrc,
    e.beforeAlt,
    e.afterAlt,
    e.mode,
    e.orientation,
    e.initialPosition,
    e.zoom,
    e.zoomMax,
    e.zoomMin,
    e.theme,
    e.handleStyle,
    e.labels,
    e.labelPosition,
    e.fullscreenButton,
    e.lazyLoad,
    e.zoomControls,
    e.zoomControlsPosition,
    e.scrollHint,
    e.keyboardStep,
    e.keyboardLargeStep,
    e.animate,
    e.animateOnce,
    e.cloudimage,
    e.onSlide,
    e.onZoom,
    e.onFullscreenChange,
    e.onReady
  ]), { containerRef: s, instance: u };
}
export {
  F as CIBeforeAfterViewer,
  Z as useCIBeforeAfter
};
//# sourceMappingURL=index.js.map
