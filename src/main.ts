import { back } from './eases/back';
import { bounce } from './eases/bounce';
import { cubicBezier } from './eases/cubicBezier';
import { easeIn } from './eases/easeIn';
import { easeInOut } from './eases/easeInOut';
import { easeOut } from './eases/easeOut';
import { yoyo } from './eases/yoyo';
import { repeat } from './eases/repeat';
import { getEase, eases } from './eases/eases';
import { ja } from './types';
import { nextAnimationFrame, tick } from './services/tick';
import { power } from './eases/power';
import { sine } from './eases/sine';
import { steps } from './eases/steps';
import { Timeline } from './components/timeline';
import { elastic } from './eases/elastic';
import { stepEnd } from './eases/stepEnd';
import { stepStart } from './eases/stepStart';

// Register built-in easings
// Linear is the fallback when an easing isn't found, so we won't register it.
eases.back = back;
eases.bounce = bounce;
eases['cubic-bezier'] = cubicBezier;
eases['ease-in'] = easeIn;
eases['ease-in-out'] = easeInOut;
eases['ease-out'] = easeOut;
eases.elastic = elastic;
eases.power = power;
eases.repeat = repeat;
eases.sine = sine;
eases.steps = steps;
eases['step-end'] = stepEnd;
eases['step-start'] = stepStart;
eases.yoyo = yoyo;

/**
 * Convenience method for doing animations.
 */
function animate<T>(
  targets: T | string,
  duration: number,
  props: Partial<ja.KeyframeProps>
) {
  return new Timeline().animate(targets, duration, props);
}

// Export out globals.
export { animate, eases, getEase, nextAnimationFrame, Timeline, tick };
