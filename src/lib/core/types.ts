export interface WebPropertyOptions {
  [name: string]:
    | PropertyResolver<PropertyValue>
    | PropertyResolver<PropertyValue>[];
}

export interface PropertyOptions {
  [name: string]:
    | PropertyValueOptions
    | PropertyResolver<PropertyValue>
    | PropertyResolver<PropertyValue>[];
}

export interface PropertyValueOptions {
  value: PropertyResolver<PropertyValue> | PropertyResolver<PropertyValue>[];
  easing?: string;
  interpolate?: Interpolator | string;
}

export interface Dictionary<T> {
  [prop: string]: T;
}

export interface SetOptions {
  [name: string]: PropertyResolver<string | number>;
}

export interface Interpolator {
  (left: any, right: any): (offset: number) => any;
}

export interface Keyframe {
  offset: number;
  value: string | number;
  easing: string;
  interpolate: Function;
  simpleFn?: boolean;
}

export type AnimationTarget = any;
export type KeyframeValue = string | number;

export interface PropertyFunction<T> {
  (target: any, index: number, len: number): T;
}

export interface PropertyObject {
  value: string | number;
  offset?: number;
  easing?: string;
  interpolate?: Interpolator | string;
}

export type PropertyValue = string | number | PropertyObject;

export type PropertyResolver<T> = T | PropertyFunction<T>;

export interface AnimationController {
  cancel(): void;
  update(time: number, playbackRate: number, isActive: boolean): void;
}

export interface AnimationPlayer extends AnimationController {
  config: TargetConfiguration;
  from: number;
  to: number;
}

export interface JustAnimatePlugin {
  name: string;
  onWillAnimate?: {
    (
      target: TargetConfiguration,
      effects: PropertyEffects,
      propToPlugin?: Dictionary<string>
    ): void;
  };
  animate(effect: Effect): AnimationController;
  getValue(target: AnimationTarget, key: string): string | number;
}

export interface PropertyKeyframe {
  easing: string;
  time: number;
  prop: string;
  plugin: string;
  index: number;
  value: string | number;
  interpolate: Interpolator | string;
}
export interface PropertyEffects {
  [name: string]: PropertyEffect[];
}

export interface PropertyEffect {
  offset: number;
  easing: string;
  value: string | number;
  interpolate: Interpolator;
}

export interface TargetConfiguration {
  target: AnimationTarget;
  targetLength: number;
  easing: string;
  from: number;
  to: number;
  endDelay: number;
  duration: number;
  stagger: number;
  propNames: string[];
  keyframes: PropertyKeyframe[];
}

export interface BaseAnimationOptions {
  targets: AnimationTarget | AnimationTarget[];

  delay?: PropertyResolver<number>;
  easing?: string;
  endDelay?: PropertyResolver<number>;
  props?: PropertyOptions;
  stagger?: number;
  web?: WebPropertyOptions;
}

export interface BaseSetOptions {
  targets: AnimationTarget | AnimationTarget[];
  at?: number;
  easing?: string;
  props?: SetOptions;
  web?: SetOptions;
}

export interface AddAnimationOptions extends BaseAnimationOptions {
  from?: number;
  to?: number;
  duration?: number;
}

export interface AnimationOptions {
  from: number;
  to: number;
  easing?: string;
  targets: AnimationTarget[];
  stagger?: number;
  delay?: PropertyResolver<number>;
  endDelay?: PropertyResolver<number>;
  props?: PropertyOptions;
  web?: WebPropertyOptions;
}

export interface Effect {
  // config: TargetConfiguration
  target: AnimationTarget;
  plugin: string;
  prop: string;
  keyframes: Keyframe[];
  to: number;
  from: number;
}

export interface References {
  [name: string]: any;
}

export interface TimelineOptions {
  id?: string;
  references?: References;
}

export type TimelineEvent =
  | 'cancel'
  | 'config'
  | 'finish'
  | 'pause'
  | 'reverse'
  | 'update'
  | 'play';

export interface IReducerContext {
  events: string[];
  needUpdate: TargetConfiguration[];
  destroyed?: boolean;
  trigger(eventName: string): void;
  dirty(config: TargetConfiguration): void;
}

export interface IReducer {
  (model: ITimelineModel, data: any, ctx: IReducerContext): void;
}

export interface ITimelineEventListener {
  (data: any): void;
}

export interface IStore {
  state: ITimelineModel;
  subs: Record<TimelineEvent, ITimelineEventListener[]>;
}

export interface ITimelineModel {
  /**
   * Internal identifier used by Just Animate
   */
  id: string;
  /**
   * Target configurations.  This includes all properties, plugins, and keyframes to use during animation.
   */
  configs: TargetConfiguration[];
  /**
   * Total active time of an animation.  In certain circumstances, the duration may increase during the active state.
   */
  duration: number;
  /**
   * Next position to insert new animations.  This is the same as duration unless an animation specifies a negative endDelay.
   * A negative endDelay can cause this to move prior to duration.
   * A positive endDelay will cause the duration to match
   */
  cursor: number;
  /**
   * The playrate of the Timeline. Positive numbers are forward and negative numbers are in reverse
   */
  rate: number;
  /**
   * References (@strings) to used as placeholders for values in the Timeline
   */
  refs: References;
  /**
   * Number of times to repeat the timeline when played.
   */
  repeat: number;
  /**
   * Number of repetitions currently played.
   */
  round: number;
  /**
   * Current state of the Timeline (inactive, starting, running, paused, etc.)
   */
  state: number;

  /**
   * Current time of the Timeline
   */
  time: number;
  /**
   * True if the timeline should alternate directions for each iteration
   */
  yoyo: boolean;
  /**
   * Animation players used to actually animate things
   */
  players: AnimationPlayer[];
  /**
   * True if the timeline should be destroyed on finish
   */
  destroy?: boolean;
}

export interface PlayOptions {
  /**
   * Number of times to repeat the Timeline.
   */
  repeat?: number;
  /**
   * True if the timeline should alternate directions for each iteration
   */
  alternate?: boolean;
  /**
   * True if the timeline should be destroyed on finish
   */
  destroy?: boolean;
}

/**
 * Adds an animation at the end of the timeline, unless from/to are specified
 * @param opts the animation definition
 */
export interface ITimeline {
  currentTime: number;
  duration: number;
  playbackRate: number;
  state: number;
  id?: string;

  /**
   * Adds an animation at the end of the timeline, unless from/to are specified
   * @param opts the animation definition
   */
  add(opts: AddAnimationOptions | AddAnimationOptions[]): this;
  /**
   * Adds an animation at the end of the timeline, unless from/to are specified
   * @param opts the animation definition
   */
  animate(opts: AddAnimationOptions | AddAnimationOptions[]): this;

  /**
   * Destroys the internal model of the timeline
   */
  destroy(): void;
  /**
   * Defines an animation that occurs starting at "from" and ending at "to".
   *
   * Note: The delay, endDelay, and stagger properties may shift the from/to times
   * @param from the starting time in milliseconds
   * @param to the ending time in milliseconds
   * @param options the animation definition.
   */
  fromTo(
    from: number,
    to: number,
    options: BaseAnimationOptions | BaseAnimationOptions[]
  ): this;
  /**
   * Adds a sequence at the current position in the timeline.  Each animation option will be added sequentially
   * @param seqOptions the animation definition.
   */
  sequence(this: ITimeline, seqOptions: AddAnimationOptions[]): this;
  /**
   * Sets the current values at the current time. If "at" is specified, it is set to that point in the timeline
   * @param options the set definitions.
   */
  set(options: BaseSetOptions | BaseSetOptions[]): this;

  /**
   * Cancels an animation, removes all effects, and resets internal state
   */
  cancel(): this;

  /**
   * Finishes an animation.  If the animation has never been active, this will
   * activate effects
   * - If playbackRate is 0 or more, the animation will seek to duration.
   * - If playbackRate is less than 0, the animation will seek to 0
   */
  finish(): this;

  /**
   * Register for timeline events
   * @param eventName timeline event name
   * @param listener callback for when the event occurs
   */
  on(eventName: TimelineEvent, listener: (time: number) => void): this;

  /**
   * Register for timeline event only one time
   * @param eventName timeline event name
   * @param listener callback for when the event occurs
   */
  once(eventName: TimelineEvent, listener: (time: number) => void): this;

  /**
   * Unregister for timeline events
   * @param eventName timeline event name
   * @param listener callback to unregister
   */
  off(eventName: TimelineEvent, listener: (time: number) => void): this;

  /**
   * Pauses execution of the animation. If the animation has never been active, this will
   * activate effects
   */
  pause(): this;
  /**
   * Plays the animation until finished.  If the animation has never been active, this will activate the effects.
   * @param iterations number of iterations to play the animation.  Use Infinity to loop forever
   * @param dir the direction the animation should play.  "normal" (default) or "alternate" (yoyo)
   */
  play(options?: PlayOptions): this;

  /**
   * Reverses the animation playbackRate.  If the animation is currently playing, it will reverse the animation
   */
  reverse(): this;

  /**
   * Seeks to a specific time.  If the animation is not active, this will activate effects.
   * @param time the time in milliseconds to seek to.
   */
  seek(time: number): this;
}
