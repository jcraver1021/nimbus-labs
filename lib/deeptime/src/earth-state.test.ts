import {describe, it, expect} from 'vitest';
import {
  EARTH_STATES,
  getEarthState,
  getEarthStateAtTime,
  resolveEarthState,
} from './earth-state';
import {GEOLOGIC_PERIODS} from './geologic-time-scale';

describe('EARTH_STATES', () => {
  it('names only divisions that exist in the time scale', () => {
    const divisions = new Set(GEOLOGIC_PERIODS.map(period => period.name));
    const unknown = EARTH_STATES.filter(
      state => !divisions.has(state.division)
    );

    expect(unknown.map(state => state.division)).toEqual([]);
  });

  it('records each division at most once', () => {
    const names = EARTH_STATES.map(state => state.division);
    expect(new Set(names).size).toBe(names.length);
  });

  it('keeps ocean coverage a fraction', () => {
    for (const state of EARTH_STATES) {
      if (state.oceanCoverage === undefined) continue;
      expect(state.oceanCoverage).toBeGreaterThan(0);
      expect(state.oceanCoverage).toBeLessThanOrEqual(1);
    }
  });
});

describe('getEarthState', () => {
  it('finds a division by name', () => {
    expect(getEarthState('Cambrian')?.oceanCoverage).toBeCloseTo(0.84);
  });

  it('returns null for a division it has nothing on', () => {
    expect(getEarthState('Chibanian')).toBeNull();
  });
});

describe('resolveEarthState', () => {
  const find = (name: string) => {
    const division = GEOLOGIC_PERIODS.find(period => period.name === name);
    if (!division) throw new Error(`no such division: ${name}`);
    return division;
  };

  it('keeps the division’s own values', () => {
    const state = resolveEarthState(find('Late Cretaceous'));

    expect(state?.seaLevelVsTodayMeters).toBe(250);
    expect(state?.headline).toMatch(/Chicxulub/);
  });

  it('inherits what the division does not record from its parents', () => {
    const state = resolveEarthState(find('Late Jurassic'));

    // Its own sea level, but the Jurassic's paleogeography and oxygen.
    expect(state?.seaLevelVsTodayMeters).toBe(140);
    expect(state?.continents).toContain('Tethys Ocean');
    expect(state?.atmosphere?.o2Percent).toBe(26);
    expect(state?.resolvedFrom).toEqual(['Late Jurassic', 'Jurassic']);
  });

  it('merges atmospheres field by field rather than wholesale', () => {
    const state = resolveEarthState(find('Lopingian'));

    expect(state?.atmosphere?.co2Ppm).toBe(1_500); // Its own.
    expect(state?.atmosphere?.o2Percent).toBe(15); // Also its own.
    expect(state?.atmosphere?.n2Percent).toBe(74); // The Permian's.
  });

  it('resolves an age all the way up the hierarchy', () => {
    const state = resolveEarthState(find('Calabrian'));

    expect(state?.division).toBe('Calabrian');
    expect(state?.headline).toMatch(/Ice ages/); // The Pleistocene's.
    expect(state?.atmosphere?.o2Percent).toBe(20.9); // The Quaternary's.
    // Only divisions that actually contributed a field are listed: by the
    // Quaternary everything is filled in, so the era and eon add nothing.
    expect(state?.resolvedFrom).toEqual(['Pleistocene', 'Quaternary']);
  });

  it('resolves every division in the time scale', () => {
    const unresolved = GEOLOGIC_PERIODS.filter(
      period => resolveEarthState(period) === null
    );

    expect(unresolved.map(period => period.name)).toEqual([]);
  });
});

describe('getEarthStateAtTime', () => {
  it('describes the present', () => {
    expect(getEarthStateAtTime(0)?.seaLevelVsTodayMeters).toBe(0);
  });

  it('describes a moment deep in the Precambrian', () => {
    expect(getEarthStateAtTime(4_400_000_000)?.division).toBe('Hadean');
  });
});
