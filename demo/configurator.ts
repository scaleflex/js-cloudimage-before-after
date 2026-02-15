import CIBeforeAfter from 'js-cloudimage-before-after';
import type { CIBeforeAfterConfig, CIBeforeAfterInstance } from 'js-cloudimage-before-after';
import kitchenBefore from './images/kitchen-before.svg';
import kitchenAfter from './images/kitchen-after.svg';

declare const Prism: { highlightElement(el: Element): void } | undefined;

const BEFORE_SRC = kitchenBefore;
const AFTER_SRC = kitchenAfter;

interface ConfigState {
  mode: CIBeforeAfterConfig['mode'];
  orientation: CIBeforeAfterConfig['orientation'];
  theme: CIBeforeAfterConfig['theme'];
  handleStyle: CIBeforeAfterConfig['handleStyle'];
  labelPosition: CIBeforeAfterConfig['labelPosition'];
  zoomControlsPosition: CIBeforeAfterConfig['zoomControlsPosition'];
  initialPosition: number;
  zoom: boolean;
  labels: boolean;
  fullscreenButton: boolean;
  animate: boolean;
}

export function initConfigurator(): void {
  const controlsEl = document.getElementById('configurator-controls');
  const codeEl = document.getElementById('generated-code');
  const copyBtn = document.getElementById('copy-code-btn');

  if (!controlsEl || !codeEl || !copyBtn) return;

  const state: ConfigState = {
    mode: 'drag',
    orientation: 'horizontal',
    theme: 'light',
    handleStyle: 'arrows',
    labelPosition: 'top',
    zoomControlsPosition: 'bottom-right',
    initialPosition: 50,
    zoom: false,
    labels: true,
    fullscreenButton: true,
    animate: false,
  };

  // Build controls UI
  controlsEl.innerHTML = `
    <div class="config-group">
      <div class="config-group-title">General</div>
      <div class="config-group-fields">
        ${select('Mode', 'mode', [['drag', 'Drag'], ['hover', 'Hover'], ['click', 'Click']])}
        ${select('Orientation', 'orientation', [['horizontal', 'Horizontal'], ['vertical', 'Vertical']])}
        ${select('Theme', 'theme', [['light', 'Light'], ['dark', 'Dark']])}
        ${range('Initial Position', 'initialPosition', 0, 100, state.initialPosition)}
      </div>
    </div>
    <div class="config-group">
      <div class="config-group-title">Handle & Labels</div>
      <div class="config-group-fields">
        ${select('Handle Style', 'handleStyle', [['arrows', 'Arrows'], ['circle', 'Circle'], ['line', 'Line']])}
        ${select('Label Position', 'labelPosition', [['top', 'Top'], ['bottom', 'Bottom']])}
        ${toggle('Labels', 'labels', state.labels)}
      </div>
    </div>
    <div class="config-group">
      <div class="config-group-title">Features</div>
      <div class="config-group-fields">
        ${toggle('Zoom', 'zoom', state.zoom)}
        ${toggle('Fullscreen Button', 'fullscreenButton', state.fullscreenButton)}
        ${select('Zoom Controls', 'zoomControlsPosition', [
          ['bottom-right', 'Bottom Right'], ['bottom-left', 'Bottom Left'],
          ['bottom-center', 'Bottom Center'], ['top-right', 'Top Right'],
          ['top-left', 'Top Left'], ['top-center', 'Top Center'],
        ], !state.zoom)}
        ${toggle('Entrance Animation', 'animate', state.animate)}
      </div>
    </div>
  `;

  // Create slider
  let instance: CIBeforeAfterInstance = new CIBeforeAfter('#configurator-slider', {
    beforeSrc: BEFORE_SRC,
    afterSrc: AFTER_SRC,
    ...buildConfig(state),
  });

  // Pin min-height to prevent layout shift
  const sliderEl = document.getElementById('configurator-slider');
  if (sliderEl) {
    requestAnimationFrame(() => {
      sliderEl.style.minHeight = `${sliderEl.offsetHeight}px`;
    });
  }

  function updateSlider(): void {
    instance.update(buildConfig(state));
    updateCode();
  }

  function updateCode(): void {
    codeEl!.textContent = generateCode(state);
    if (typeof Prism !== 'undefined') Prism.highlightElement(codeEl!);
  }

  // Bind events
  controlsEl.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const key = target.dataset.key as keyof ConfigState;
    if (!key) return;

    if (target.type === 'checkbox') {
      (state as Record<string, unknown>)[key] = (target as HTMLInputElement).checked;
    } else if (target.type === 'range') {
      (state as Record<string, unknown>)[key] = parseInt(target.value);
    } else {
      (state as Record<string, unknown>)[key] = target.value;
    }

    // Enable/disable zoom controls position when zoom is toggled
    if (key === 'zoom') {
      const zoomCtrl = controlsEl.querySelector('[data-control="zoomControlsPosition"]') as HTMLElement | null;
      const zoomSelect = zoomCtrl?.querySelector('select') as HTMLSelectElement | null;
      if (zoomCtrl) zoomCtrl.classList.toggle('control-group--disabled', !state.zoom);
      if (zoomSelect) zoomSelect.disabled = !state.zoom;
    }

    updateSlider();
  });

  controlsEl.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement;
    if (target.type === 'range') {
      const key = target.dataset.key as keyof ConfigState;
      if (key) {
        (state as Record<string, unknown>)[key] = parseInt(target.value);
        const label = target.closest('.control-group')?.querySelector('span');
        if (label) label.textContent = target.value;
        updateSlider();
      }
    }
  });

  // Copy button
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(generateCode(state)).then(() => {
      copyBtn.classList.add('copied');
      setTimeout(() => { copyBtn.classList.remove('copied'); }, 2000);
    });
  });

  // Initial code render
  updateCode();
}

function buildConfig(state: ConfigState): Partial<CIBeforeAfterConfig> {
  return {
    mode: state.mode,
    orientation: state.orientation,
    theme: state.theme,
    handleStyle: state.handleStyle,
    labelPosition: state.labelPosition,
    zoomControlsPosition: state.zoomControlsPosition,
    initialPosition: state.initialPosition,
    zoom: state.zoom,
    labels: state.labels,
    fullscreenButton: state.fullscreenButton,
    animate: state.animate,
  };
}

function generateCode(state: ConfigState): string {
  const opts: string[] = [
    `  beforeSrc: '/before.jpg',`,
    `  afterSrc: '/after.jpg',`,
  ];

  if (state.mode !== 'drag') opts.push(`  mode: '${state.mode}',`);
  if (state.orientation !== 'horizontal') opts.push(`  orientation: '${state.orientation}',`);
  if (state.initialPosition !== 50) opts.push(`  initialPosition: ${state.initialPosition},`);
  if (state.zoom) opts.push(`  zoom: true,`);
  if (state.theme !== 'light') opts.push(`  theme: '${state.theme}',`);
  if (state.handleStyle !== 'arrows') opts.push(`  handleStyle: '${state.handleStyle}',`);
  if (!state.labels) opts.push(`  labels: false,`);
  if (state.labelPosition !== 'top') opts.push(`  labelPosition: '${state.labelPosition}',`);
  if (!state.fullscreenButton) opts.push(`  fullscreenButton: false,`);
  if (state.animate) opts.push(`  animate: true,`);
  if (state.zoom && state.zoomControlsPosition !== 'bottom-right') {
    opts.push(`  zoomControlsPosition: '${state.zoomControlsPosition}',`);
  }

  return `new CIBeforeAfter('#my-slider', {\n${opts.join('\n')}\n});`;
}

// Control builders
function select(label: string, key: string, options: string[][], disabled = false): string {
  const opts = options.map(([v, l]) => `<option value="${v}">${l}</option>`).join('');
  return `<div class="control-group${disabled ? ' control-group--disabled' : ''}" data-control="${key}">
    <label>${label}</label>
    <select data-key="${key}"${disabled ? ' disabled' : ''}>${opts}</select>
  </div>`;
}

function toggle(label: string, key: string, checked: boolean): string {
  return `<div class="control-group">
    <label class="toggle">
      <input type="checkbox" data-key="${key}" ${checked ? 'checked' : ''} />
      ${label}
    </label>
  </div>`;
}

function range(label: string, key: string, min: number, max: number, value: number): string {
  return `<div class="control-group">
    <label>${label}: <span>${value}</span></label>
    <input type="range" data-key="${key}" min="${min}" max="${max}" value="${value}" />
  </div>`;
}
