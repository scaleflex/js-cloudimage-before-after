import type {
  CIBeforeAfterConfig,
  ResolvedConfig,
  InteractionMode,
  Orientation,
  HandleStyle,
  Theme,
  LabelPosition,
  ZoomControlsPosition,
} from './types';

const VALID_MODES: InteractionMode[] = ['drag', 'hover', 'click'];
const VALID_ORIENTATIONS: Orientation[] = ['horizontal', 'vertical'];
const VALID_THEMES: Theme[] = ['light', 'dark'];
const VALID_HANDLE_STYLES: HandleStyle[] = ['arrows', 'circle', 'line'];
const VALID_LABEL_POSITIONS: LabelPosition[] = ['top', 'bottom'];
const VALID_ZOOM_POSITIONS: ZoomControlsPosition[] = [
  'top-left', 'top-center', 'top-right',
  'bottom-left', 'bottom-center', 'bottom-right',
];

const DEFAULTS: Omit<ResolvedConfig, 'beforeSrc' | 'afterSrc'> = {
  beforeAlt: 'Before',
  afterAlt: 'After',
  mode: 'drag',
  orientation: 'horizontal',
  initialPosition: 50,
  zoom: false,
  zoomMax: 4,
  zoomMin: 1,
  theme: 'light',
  handleStyle: 'arrows',
  labelsEnabled: true,
  labelBefore: 'Before',
  labelAfter: 'After',
  labelPosition: 'top',
  animateEnabled: false,
  animateDuration: 800,
  animateDelay: 0,
  animateEasing: 'ease-out',
  animateOnce: true,
  fullscreenButton: true,
  lazyLoad: true,
  zoomControls: true,
  zoomControlsPosition: 'bottom-right',
  scrollHint: true,
  keyboardStep: 1,
  keyboardLargeStep: 10,
};

export function resolveConfig(config: CIBeforeAfterConfig): ResolvedConfig {
  const labels = config.labels;
  let labelsEnabled = true;
  let labelBefore = 'Before';
  let labelAfter = 'After';

  if (labels === false) {
    labelsEnabled = false;
  } else if (typeof labels === 'object') {
    labelBefore = labels.before ?? 'Before';
    labelAfter = labels.after ?? 'After';
  }

  const animate = config.animate;
  let animateEnabled = false;
  let animateDuration = 800;
  let animateDelay = 0;
  let animateEasing = 'ease-out';

  if (animate === true) {
    animateEnabled = true;
  } else if (typeof animate === 'object') {
    animateEnabled = true;
    animateDuration = Math.max(0, animate.duration ?? 800);
    animateDelay = Math.max(0, animate.delay ?? 0);
    animateEasing = animate.easing ?? 'ease-out';
  }

  const zoom = config.zoom ?? DEFAULTS.zoom;

  return {
    beforeSrc: config.beforeSrc,
    afterSrc: config.afterSrc,
    beforeAlt: config.beforeAlt ?? DEFAULTS.beforeAlt,
    afterAlt: config.afterAlt ?? DEFAULTS.afterAlt,
    mode: validateEnumWithDefault(config.mode, VALID_MODES, DEFAULTS.mode, 'mode'),
    orientation: validateEnumWithDefault(config.orientation, VALID_ORIENTATIONS, DEFAULTS.orientation, 'orientation'),
    initialPosition: clampPosition(config.initialPosition ?? DEFAULTS.initialPosition),
    zoom,
    zoomMax: Math.max(1, config.zoomMax ?? DEFAULTS.zoomMax),
    zoomMin: Math.max(1, Math.min(config.zoomMin ?? DEFAULTS.zoomMin, config.zoomMax ?? DEFAULTS.zoomMax)),
    theme: validateEnumWithDefault(config.theme, VALID_THEMES, DEFAULTS.theme, 'theme'),
    handleStyle: validateEnumWithDefault(config.handleStyle, VALID_HANDLE_STYLES, DEFAULTS.handleStyle, 'handleStyle'),
    labelsEnabled,
    labelBefore,
    labelAfter,
    labelPosition: validateEnumWithDefault(config.labelPosition, VALID_LABEL_POSITIONS, DEFAULTS.labelPosition, 'labelPosition'),
    animateEnabled,
    animateDuration,
    animateDelay,
    animateEasing,
    animateOnce: config.animateOnce ?? DEFAULTS.animateOnce,
    fullscreenButton: config.fullscreenButton ?? DEFAULTS.fullscreenButton,
    lazyLoad: config.lazyLoad ?? DEFAULTS.lazyLoad,
    zoomControls: config.zoomControls ?? (zoom ? DEFAULTS.zoomControls : false),
    zoomControlsPosition: validateEnumWithDefault(config.zoomControlsPosition, VALID_ZOOM_POSITIONS, DEFAULTS.zoomControlsPosition, 'zoomControlsPosition'),
    scrollHint: config.scrollHint ?? (zoom ? DEFAULTS.scrollHint : false),
    keyboardStep: Math.max(0.5, config.keyboardStep ?? DEFAULTS.keyboardStep),
    keyboardLargeStep: Math.max(1, config.keyboardLargeStep ?? DEFAULTS.keyboardLargeStep),
    onSlide: config.onSlide,
    onZoom: config.onZoom,
    onFullscreenChange: config.onFullscreenChange,
    onReady: config.onReady,
    aspectRatio: config.aspectRatio,
    cloudimage: config.cloudimage,
  };
}

function validateEnum<T extends string>(value: string, allowed: T[], name: string): T | undefined {
  if ((allowed as string[]).includes(value)) return value as T;
  console.warn(`CIBeforeAfter: Invalid ${name} "${value}". Allowed: ${allowed.join(', ')}`);
  return undefined;
}

function validateEnumWithDefault<T extends string>(value: T | undefined, allowed: T[], defaultValue: T, name: string): T {
  if (value === undefined) return defaultValue;
  if ((allowed as string[]).includes(value)) return value;
  console.warn(`CIBeforeAfter: Invalid ${name} "${value}". Allowed: ${allowed.join(', ')}. Using default "${defaultValue}".`);
  return defaultValue;
}

export function parseDataAttributes(el: HTMLElement): CIBeforeAfterConfig {
  const get = (name: string): string | null => el.getAttribute(`data-ci-before-after-${name}`);
  const getBool = (name: string): boolean | undefined => {
    const val = get(name);
    if (val === null) return undefined;
    return val === 'true';
  };
  const getNum = (name: string): number | undefined => {
    const val = get(name);
    if (val === null) return undefined;
    const n = parseFloat(val);
    return isNaN(n) ? undefined : n;
  };

  const beforeSrc = get('before-src');
  const afterSrc = get('after-src');

  if (!beforeSrc || !afterSrc) {
    throw new Error('CIBeforeAfter: data-ci-before-after-before-src and data-ci-before-after-after-src are required');
  }

  const config: CIBeforeAfterConfig = {
    beforeSrc,
    afterSrc,
  };

  const beforeAlt = get('before-alt');
  if (beforeAlt !== null) config.beforeAlt = beforeAlt;

  const afterAlt = get('after-alt');
  if (afterAlt !== null) config.afterAlt = afterAlt;

  const mode = get('mode');
  if (mode) config.mode = validateEnum(mode, VALID_MODES, 'mode');

  const orientation = get('orientation');
  if (orientation) config.orientation = validateEnum(orientation, VALID_ORIENTATIONS, 'orientation');

  const initialPosition = getNum('initial-position');
  if (initialPosition !== undefined) config.initialPosition = initialPosition;

  const zoom = getBool('zoom');
  if (zoom !== undefined) config.zoom = zoom;

  const zoomMax = getNum('zoom-max');
  if (zoomMax !== undefined) config.zoomMax = zoomMax;

  const zoomMin = getNum('zoom-min');
  if (zoomMin !== undefined) config.zoomMin = zoomMin;

  const theme = get('theme');
  if (theme) config.theme = validateEnum(theme, VALID_THEMES, 'theme');

  const handleStyle = get('handle-style');
  if (handleStyle) config.handleStyle = validateEnum(handleStyle, VALID_HANDLE_STYLES, 'handleStyle');

  const labelsAttr = getBool('labels');
  const labelBefore = get('label-before');
  const labelAfter = get('label-after');

  if (labelsAttr === false) {
    config.labels = false;
  } else if (labelBefore !== null || labelAfter !== null) {
    config.labels = {
      before: labelBefore ?? undefined,
      after: labelAfter ?? undefined,
    };
  } else if (labelsAttr === true) {
    config.labels = true;
  }

  const labelPosition = get('label-position');
  if (labelPosition) config.labelPosition = validateEnum(labelPosition, VALID_LABEL_POSITIONS, 'labelPosition');

  const animateAttr = getBool('animate');
  const animateDuration = getNum('animate-duration');
  const animateDelay = getNum('animate-delay');
  const animateEasing = get('animate-easing');

  if (animateDuration !== undefined || animateDelay !== undefined || (animateEasing !== null && animateEasing !== undefined)) {
    config.animate = {
      duration: animateDuration,
      delay: animateDelay,
      easing: animateEasing ?? undefined,
    };
  } else if (animateAttr !== undefined) {
    config.animate = animateAttr;
  }

  const animateOnce = getBool('animate-once');
  if (animateOnce !== undefined) config.animateOnce = animateOnce;

  const fullscreenButton = getBool('fullscreen-button');
  if (fullscreenButton !== undefined) config.fullscreenButton = fullscreenButton;

  const lazyLoad = getBool('lazy-load');
  if (lazyLoad !== undefined) config.lazyLoad = lazyLoad;

  const zoomControls = getBool('zoom-controls');
  if (zoomControls !== undefined) config.zoomControls = zoomControls;

  const zoomControlsPosition = get('zoom-controls-position');
  if (zoomControlsPosition) config.zoomControlsPosition = validateEnum(zoomControlsPosition, VALID_ZOOM_POSITIONS, 'zoomControlsPosition');

  const scrollHint = getBool('scroll-hint');
  if (scrollHint !== undefined) config.scrollHint = scrollHint;

  const keyboardStep = getNum('keyboard-step');
  if (keyboardStep !== undefined) config.keyboardStep = keyboardStep;

  const keyboardLargeStep = getNum('keyboard-large-step');
  if (keyboardLargeStep !== undefined) config.keyboardLargeStep = keyboardLargeStep;

  const aspectRatio = get('aspect-ratio');
  if (aspectRatio !== null) config.aspectRatio = aspectRatio;

  const ciToken = get('ci-token');
  if (ciToken) {
    config.cloudimage = {
      token: ciToken,
      apiVersion: get('ci-api-version') ?? undefined,
      domain: get('ci-domain') ?? undefined,
      limitFactor: getNum('ci-limit-factor'),
      params: get('ci-params') ?? undefined,
    };
  }

  return config;
}

function clampPosition(value: number): number {
  if (!isFinite(value)) return 50;
  return Math.max(0, Math.min(100, value));
}
