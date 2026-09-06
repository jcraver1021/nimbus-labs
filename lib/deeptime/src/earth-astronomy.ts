/**
 * Earth's rotation and the Moon's orbit over deep time.
 *
 * Tidal friction has been slowing Earth's spin and pushing the Moon outward
 * ever since the Moon formed, so both the length of a day and the size of the
 * Moon in the sky depend on how far back you look. Day length here comes from
 * an empirical curve fitted to published proxies; everything else follows from
 * it by conservation of the Earth-Moon system's angular momentum, which means
 * the whole model is anchored on one measured quantity rather than several.
 */

import type {TimePoint} from './temporal-graph';
import {getTimeValue} from './temporal-graph';

/**
 * Day length (hours) at a given time (years ago), from tidal rhythmites,
 * cyclostratigraphy, and eclipse records. The long flat stretch through the
 * Proterozoic is the tidal resonance of Bartlett & Stevenson (2016); the
 * 1400 Ma point is Meyers & Malinverno (2018) and the 620 Ma point is
 * Williams (2000). Values before ~3 Ga are extrapolations with error bars
 * measured in hours, not minutes.
 */
const DAY_LENGTH_ANCHORS: ReadonlyArray<
  readonly [yearsAgo: number, hours: number]
> = [
  [0, 24.0],
  [100_000_000, 23.5],
  [250_000_000, 22.7],
  [400_000_000, 21.8],
  [620_000_000, 21.0],
  [900_000_000, 19.5],
  [1_400_000_000, 18.7],
  [2_000_000_000, 18.4],
  [2_450_000_000, 17.1],
  [3_000_000_000, 15.0],
  [3_500_000_000, 12.0],
  [4_000_000_000, 9.0],
  [4_500_000_000, 5.0],
];

/** Earth's polar moment of inertia, kg m². */
const EARTH_MOMENT_OF_INERTIA = 8.034e37;

/** Reduced mass of the Earth-Moon system, kg. */
const EARTH_MOON_REDUCED_MASS = 7.2528e22;

/** G × (Earth mass + Moon mass), m³/s². */
const EARTH_MOON_GRAVITATIONAL_PARAMETER = 4.0348e14;

/** The Moon's mean radius, km. */
const MOON_RADIUS_KM = 1_737.4;

/** Semi-major axis of the Moon's orbit today, km. */
export const PRESENT_LUNAR_DISTANCE_KM = 384_400;

/** The Moon's mean angular diameter today, degrees (about 31 arcminutes). */
export const PRESENT_MOON_ANGULAR_DIAMETER_DEGREES = 0.5181;

/**
 * Seconds in a year. The orbital year has barely changed over Earth's history
 * — only the *number of days* it contains has — so this is treated as fixed.
 */
const SECONDS_PER_YEAR = 3.1558e7;

const SECONDS_PER_HOUR = 3_600;

/** Earth's spin rate, radians/second, for a day of the given length. */
function spinRate(dayLengthHours: number): number {
  return (2 * Math.PI) / (dayLengthHours * SECONDS_PER_HOUR);
}

/** Orbital angular momentum of the Moon at a given semi-major axis (km). */
function orbitalAngularMomentum(distanceKm: number): number {
  return (
    EARTH_MOON_REDUCED_MASS *
    Math.sqrt(EARTH_MOON_GRAVITATIONAL_PARAMETER * distanceKm * 1_000)
  );
}

/**
 * Total angular momentum of the Earth-Moon system, derived from present-day
 * values so that the model reproduces today's Moon exactly at time zero.
 */
const TOTAL_ANGULAR_MOMENTUM =
  EARTH_MOMENT_OF_INERTIA * spinRate(24) +
  orbitalAngularMomentum(PRESENT_LUNAR_DISTANCE_KM);

/**
 * Length of the solar day, in hours, at a time in the past. Linearly
 * interpolated between the anchor points above, and clamped at both ends.
 */
export function getDayLengthHours(time: TimePoint): number {
  const yearsAgo = Math.max(0, getTimeValue(time));

  const last = DAY_LENGTH_ANCHORS[DAY_LENGTH_ANCHORS.length - 1];
  if (yearsAgo >= last[0]) return last[1];

  for (let i = 1; i < DAY_LENGTH_ANCHORS.length; i++) {
    const [olderYears, olderHours] = DAY_LENGTH_ANCHORS[i];
    if (yearsAgo > olderYears) continue;

    const [youngerYears, youngerHours] = DAY_LENGTH_ANCHORS[i - 1];
    const fraction = (yearsAgo - youngerYears) / (olderYears - youngerYears);
    return youngerHours + fraction * (olderHours - youngerHours);
  }

  return DAY_LENGTH_ANCHORS[0][1];
}

/**
 * Days in a year at a time in the past. The year keeps the same length while
 * the day gets shorter the further back you go, so the count goes up.
 */
export function getDaysPerYear(time: TimePoint): number {
  return SECONDS_PER_YEAR / (getDayLengthHours(time) * SECONDS_PER_HOUR);
}

/**
 * Semi-major axis of the Moon's orbit, in km, at a time in the past. Whatever
 * angular momentum Earth's faster spin held back then had to come out of the
 * Moon's orbit, which puts the Moon closer in.
 */
export function getLunarDistanceKm(time: TimePoint): number {
  const spin = EARTH_MOMENT_OF_INERTIA * spinRate(getDayLengthHours(time));
  const orbital = TOTAL_ANGULAR_MOMENTUM - spin;

  return (
    (orbital / EARTH_MOON_REDUCED_MASS) ** 2 /
    EARTH_MOON_GRAVITATIONAL_PARAMETER /
    1_000
  );
}

/** Angular diameter of the Moon, in degrees, as seen from Earth's surface. */
export function getMoonAngularDiameterDegrees(time: TimePoint): number {
  const distanceKm = getLunarDistanceKm(time);
  const radians = 2 * Math.atan(MOON_RADIUS_KM / distanceKm);

  return (radians * 180) / Math.PI;
}

export interface SkyState {
  dayLengthHours: number;
  daysPerYear: number;
  lunarDistanceKm: number;
  moonAngularDiameterDegrees: number;
  /** How much wider the Moon looked than it does today, e.g. 2 for twice. */
  moonAngularDiameterVsToday: number;
}

/**
 * Everything the sky model has to say about one moment in the past, gathered
 * into a single value so callers displaying all of it only interpolate once.
 */
export function getSkyState(time: TimePoint): SkyState {
  const moonAngularDiameterDegrees = getMoonAngularDiameterDegrees(time);

  return {
    dayLengthHours: getDayLengthHours(time),
    daysPerYear: getDaysPerYear(time),
    lunarDistanceKm: getLunarDistanceKm(time),
    moonAngularDiameterDegrees,
    moonAngularDiameterVsToday:
      moonAngularDiameterDegrees / PRESENT_MOON_ANGULAR_DIAMETER_DEGREES,
  };
}
