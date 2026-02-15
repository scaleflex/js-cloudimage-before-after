import { CIBeforeAfterCore } from './core/ci-before-after';
import type { CIBeforeAfterConfig, CIBeforeAfterInstance } from './core/types';
import './styles/index.css';
export type { CIBeforeAfterConfig, CIBeforeAfterInstance, InteractionMode, Orientation, HandleStyle, Theme, LabelPosition, ZoomControlsPosition, AnimateConfig, CloudimageConfig, SliderState, } from './core/types';
export { CIBeforeAfterCore };
declare class CIBeforeAfter extends CIBeforeAfterCore {
    static autoInit(root?: HTMLElement): CIBeforeAfterInstance[];
    constructor(target: HTMLElement | string, config: CIBeforeAfterConfig);
}
export default CIBeforeAfter;
export { CIBeforeAfter };
