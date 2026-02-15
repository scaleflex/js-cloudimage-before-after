import { CIBeforeAfterCore } from './core/ci-before-after';
import { parseDataAttributes } from './core/config';
import { isBrowser, injectStyles } from './utils/dom';
import type { CIBeforeAfterConfig, CIBeforeAfterInstance } from './core/types';
import cssText from './styles/index.css?inline';

export type {
  CIBeforeAfterConfig,
  CIBeforeAfterInstance,
  InteractionMode,
  Orientation,
  HandleStyle,
  Theme,
  LabelPosition,
  ZoomControlsPosition,
  AnimateConfig,
  CloudimageConfig,
  SliderState,
} from './core/types';

// QUAL-01: Export CIBeforeAfterCore for React wrapper
export { CIBeforeAfterCore };

class CIBeforeAfter extends CIBeforeAfterCore {
  static autoInit(root?: HTMLElement): CIBeforeAfterInstance[] {
    if (!isBrowser()) return [];
    injectStyles(cssText);

    const parent = root || document;
    const elements = parent.querySelectorAll<HTMLElement>('[data-ci-before-after-before-src]');
    const instances: CIBeforeAfterInstance[] = [];

    elements.forEach((el) => {
      const config = parseDataAttributes(el);
      instances.push(new CIBeforeAfter(el, config));
    });

    return instances;
  }

  constructor(target: HTMLElement | string, config: CIBeforeAfterConfig) {
    injectStyles(cssText);
    super(target, config);
  }
}

export default CIBeforeAfter;
export { CIBeforeAfter };
