import {describe, it, expect} from 'vitest';
import {
  getDayLengthHours,
  getDaysPerYear,
  getLunarDistanceKm,
  getMoonAngularDiameterDegrees,
  getSkyState,
  PRESENT_LUNAR_DISTANCE_KM,
  PRESENT_MOON_ANGULAR_DIAMETER_DEGREES,
} from './earth-astronomy';

describe('getDayLengthHours', () => {
  it('is 24 hours today', () => {
    expect(getDayLengthHours(0)).toBe(24);
  });

  it('interpolates between anchor points', () => {
    // Halfway between the 0 Ma (24.0 h) and 100 Ma (23.5 h) anchors.
    expect(getDayLengthHours(50_000_000)).toBeCloseTo(23.75, 5);
  });

  it('gets shorter the further back it looks, without exception', () => {
    let previous = getDayLengthHours(0);

    for (let yearsAgo = 0; yearsAgo <= 4_600_000_000; yearsAgo += 10_000_000) {
      const current = getDayLengthHours(yearsAgo);
      expect(current).toBeLessThanOrEqual(previous);
      previous = current;
    }
  });

  it('clamps beyond the ends of the curve', () => {
    expect(getDayLengthHours(-1_000)).toBe(24);
    expect(getDayLengthHours(4_600_000_000)).toBe(
      getDayLengthHours(4_500_000_000)
    );
  });

  it('accepts an uncertain time and uses its best estimate', () => {
    expect(getDayLengthHours({min: 0, max: 100_000_000, best: 0})).toBe(24);
  });
});

describe('getDaysPerYear', () => {
  it('is about 365 today', () => {
    expect(getDaysPerYear(0)).toBeCloseTo(365.3, 1);
  });

  it('rises as the day shortens', () => {
    expect(getDaysPerYear(600_000_000)).toBeGreaterThan(400);
    expect(getDaysPerYear(4_500_000_000)).toBeGreaterThan(1_700);
  });
});

describe('getLunarDistanceKm', () => {
  it("reproduces the Moon's present orbit", () => {
    expect(getLunarDistanceKm(0)).toBeCloseTo(PRESENT_LUNAR_DISTANCE_KM, 0);
  });

  it('puts the Moon closer the further back it looks', () => {
    expect(getLunarDistanceKm(600_000_000)).toBeLessThan(
      PRESENT_LUNAR_DISTANCE_KM
    );
    expect(getLunarDistanceKm(4_500_000_000)).toBeLessThan(
      getLunarDistanceKm(3_000_000_000)
    );
  });

  it('keeps the newborn Moon outside the Roche limit', () => {
    // Below roughly 18,000 km the Moon would have been torn apart, so a model
    // that puts it closer than that is telling us something is wrong.
    expect(getLunarDistanceKm(4_500_000_000)).toBeGreaterThan(18_000);
  });
});

describe('getMoonAngularDiameterDegrees', () => {
  it("matches the Moon's measured half-degree today", () => {
    expect(getMoonAngularDiameterDegrees(0)).toBeCloseTo(
      PRESENT_MOON_ANGULAR_DIAMETER_DEGREES,
      2
    );
  });

  it('shows a much larger Moon in the Hadean sky', () => {
    expect(getMoonAngularDiameterDegrees(4_500_000_000)).toBeGreaterThan(5);
  });
});

describe('getSkyState', () => {
  it('agrees with the individual functions', () => {
    const yearsAgo = 250_000_000;
    const state = getSkyState(yearsAgo);

    expect(state.dayLengthHours).toBe(getDayLengthHours(yearsAgo));
    expect(state.daysPerYear).toBe(getDaysPerYear(yearsAgo));
    expect(state.lunarDistanceKm).toBe(getLunarDistanceKm(yearsAgo));
    expect(state.moonAngularDiameterDegrees).toBe(
      getMoonAngularDiameterDegrees(yearsAgo)
    );
  });

  it('reports the present-day Moon as its own baseline', () => {
    expect(getSkyState(0).moonAngularDiameterVsToday).toBeCloseTo(1, 2);
  });
});
