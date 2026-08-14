export type AnimationConfig = {
  /** How long elements take to rise before a comparison (ms). */
  riseDuration: number;
  /** How long elements take to slide when swapping positions (ms). */
  slideDuration: number;
  /** How long elements take to lower after a comparison or swap (ms). */
  lowerDuration: number;
};

export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  riseDuration: 300,
  slideDuration: 350,
  lowerDuration: 200,
};

/**
 * Returns a new config with all durations divided by speed.
 * speed > 1 = faster (shorter delays), speed < 1 = slower.
 */
export function scaleAnimation(
  config: AnimationConfig,
  speed: number
): AnimationConfig {
  return {
    riseDuration: Math.round(config.riseDuration / speed),
    slideDuration: Math.round(config.slideDuration / speed),
    lowerDuration: Math.round(config.lowerDuration / speed),
  };
}
