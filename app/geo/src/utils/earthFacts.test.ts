import {describe, it, expect} from 'vitest';
import {getSkyState, type ResolvedEarthState} from '@nimbus-labs/deeptime';
import {
  buildEarthFacts,
  formatDuration,
  formatInheritance,
  formatSpan,
} from './earthFacts';

const factsFor = (state: ResolvedEarthState | null, yearsAgo = 0) =>
  buildEarthFacts(state, getSkyState(yearsAgo));

const valueOf = (state: ResolvedEarthState | null, label: string) =>
  factsFor(state).find(fact => fact.label === label);

describe('buildEarthFacts', () => {
  it('states water coverage as a percentage of the surface', () => {
    const fact = valueOf(
      {division: 'Cretaceous', resolvedFrom: [], oceanCoverage: 0.82},
      'Water coverage'
    );

    expect(fact?.value).toBe('82% of the surface');
    expect(fact?.detail).toBe('Today: 71%');
  });

  it('says which side of today’s sea level a division sat on', () => {
    const above = valueOf(
      {division: 'a', resolvedFrom: [], seaLevelVsTodayMeters: 250},
      'Sea level'
    );
    const below = valueOf(
      {division: 'b', resolvedFrom: [], seaLevelVsTodayMeters: -60},
      'Sea level'
    );
    const same = valueOf(
      {division: 'c', resolvedFrom: [], seaLevelVsTodayMeters: 0},
      'Sea level'
    );

    expect(above?.value).toBe('250 m above today');
    expect(below?.value).toBe('60 m below today');
    expect(same?.value).toBe('the same as today');
  });

  it('lists the landmasses as items', () => {
    const fact = valueOf(
      {division: 'a', resolvedFrom: [], continents: ['Laurasia', 'Gondwana']},
      'Land'
    );

    expect(fact?.items).toEqual(['Laurasia', 'Gondwana']);
    expect(fact?.value).toBe('2 major landmasses and oceans');
  });

  it('switches CO2 from ppm to percent once ppm stops being readable', () => {
    const ppm = valueOf(
      {division: 'a', resolvedFrom: [], atmosphere: {co2Ppm: 1_500}},
      'Atmosphere'
    );
    const percent = valueOf(
      {division: 'b', resolvedFrom: [], atmosphere: {co2Ppm: 500_000}},
      'Atmosphere'
    );

    expect(ppm?.items).toEqual(['1,500 ppm CO₂']);
    expect(percent?.items).toEqual(['50.0% CO₂']);
  });

  it('keeps trace oxygen from rounding away to nothing', () => {
    const fact = valueOf(
      {
        division: 'Neoarchean',
        resolvedFrom: [],
        atmosphere: {o2Percent: 0.0001},
      },
      'Atmosphere'
    );

    expect(fact?.items).toEqual(['0.0001% O₂']);
  });

  it('carries the atmosphere’s note through as its detail', () => {
    const fact = valueOf(
      {
        division: 'a',
        resolvedFrom: [],
        atmosphere: {o2Percent: 0, note: 'No free oxygen at all.'},
      },
      'Atmosphere'
    );

    expect(fact?.detail).toBe('No free oxygen at all.');
  });

  it('compares temperature with today’s', () => {
    const warmer = valueOf(
      {division: 'a', resolvedFrom: [], meanSurfaceTemperatureC: 25},
      'Mean surface temperature'
    );
    const cooler = valueOf(
      {division: 'b', resolvedFrom: [], meanSurfaceTemperatureC: 12},
      'Mean surface temperature'
    );

    expect(warmer?.value).toBe('25 °C');
    expect(warmer?.detail).toBe('11 °C warmer than today');
    expect(cooler?.detail).toBe('2 °C cooler than today');
  });

  it('always reports the sky, even with nothing curated for the division', () => {
    const facts = factsFor(null);

    expect(facts.map(fact => fact.label)).toEqual(['Day length', 'Moon']);
    expect(facts[0].value).toBe('24.0 hours');
    expect(facts[0].detail).toBe('365 days in a year');
    expect(facts[1].value).toBe('0.52° across');
    expect(facts[1].detail).toBe(
      '384,000 km away — about the same width as today'
    );
  });

  it('reports a bigger, closer Moon deep in the past', () => {
    const moon = factsFor(null, 4_500_000_000).find(
      fact => fact.label === 'Moon'
    );

    expect(moon?.detail).toMatch(/as wide as today$/);
    expect(moon?.detail).toMatch(/19,000 km away/);
  });

  it('leaves out facts the division has nothing recorded for', () => {
    expect(
      factsFor({division: 'a', resolvedFrom: []}).map(f => f.label)
    ).toEqual(['Day length', 'Moon']);
  });
});

describe('formatDuration', () => {
  it('scales its units to the length of the division', () => {
    expect(formatDuration(11_700)).toBe('11.7k years');
    expect(formatDuration(4_200)).toBe('4.2k years');
    expect(formatDuration(18_500_000)).toBe('18.5M years');
    expect(formatDuration(600_000_000)).toBe('600.0M years');
    expect(formatDuration(1_500_000_000)).toBe('1.50B years');
  });
});

describe('formatSpan', () => {
  it('reads from the younger edge to the older one', () => {
    expect(formatSpan(145_000_000, 163_500_000)).toBe(
      '145.0M years ago – 163.5M years ago'
    );
  });
});

describe('formatInheritance', () => {
  it('says nothing when every value describes the division on screen', () => {
    expect(
      formatInheritance({division: 'Jurassic', resolvedFrom: ['Jurassic']})
    ).toBeNull();
  });

  it('names the broader divisions some values came from', () => {
    expect(
      formatInheritance({
        division: 'Late Jurassic',
        resolvedFrom: ['Late Jurassic', 'Jurassic', 'Mesozoic'],
      })
    ).toBe('Some values are recorded for the whole Jurassic, then Mesozoic.');
  });

  it('says nothing at all when there is no state', () => {
    expect(formatInheritance(null)).toBeNull();
  });
});
