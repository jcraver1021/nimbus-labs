import {describe, it, expect} from 'vitest';
import {GEOLOGIC_PERIODS} from '@nimbus-labs/deeptime';
import {
  buildDiveSpine,
  eonJumps,
  stratumTime,
  EARTH_FORMED_YEARS_AGO,
} from './diveSpine';

const strata = buildDiveSpine();

describe('buildDiveSpine', () => {
  it('starts at the present and ends at Earth’s formation', () => {
    expect(strata[0].division.start).toBe(0);
    expect(strata[strata.length - 1].division.end).toBe(EARTH_FORMED_YEARS_AGO);
  });

  it('covers deep time with no gaps and no overlaps', () => {
    let expectedStart = 0;

    for (const stratum of strata) {
      expect(stratum.division.start).toBe(expectedStart);
      expectedStart = stratum.division.end;
    }

    expect(expectedStart).toBe(EARTH_FORMED_YEARS_AGO);
  });

  it('uses epochs through the Phanerozoic', () => {
    const phanerozoic = strata.filter(stratum => stratum.eon === 'Phanerozoic');

    // The Carboniferous is the one Phanerozoic period the time scale divides
    // into sub-epochs (Mississippian, Pennsylvanian) rather than epochs.
    for (const stratum of phanerozoic) {
      const level = stratum.division.level;
      expect(level === 'epoch' || level === 'sub-epoch').toBe(true);
    }

    expect(
      phanerozoic.filter(stratum => stratum.division.level === 'sub-epoch')
    ).toHaveLength(2);
  });

  it('falls back to coarser levels where the Precambrian has nothing finer', () => {
    const levelOf = (name: string) =>
      strata.find(stratum => stratum.division.name === name)?.division.level;

    expect(levelOf('Ediacaran')).toBe('period'); // Proterozoic periods exist.
    expect(levelOf('Neoarchean')).toBe('era'); // Archean has only eras.
    expect(levelOf('Hadean')).toBe('eon'); // The Hadean has only itself.
  });

  it('never repeats a division', () => {
    const names = strata.map(stratum => stratum.division.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('gives every block a colour, an eon, and an Earth state', () => {
    for (const stratum of strata) {
      expect(stratum.color).toMatch(/^#/);
      expect(stratum.eon).not.toBe('');
      expect(stratum.earthState).not.toBeNull();
    }
  });

  it('names the containing divisions coarsest first', () => {
    const jurassic = strata.find(
      stratum => stratum.division.name === 'Late Jurassic'
    );

    expect(jurassic?.ancestry).toEqual(['Phanerozoic', 'Mesozoic', 'Jurassic']);
  });

  it('draws only from divisions the time scale defines', () => {
    for (const stratum of strata) {
      expect(GEOLOGIC_PERIODS).toContain(stratum.division);
    }
  });
});

describe('stratumTime', () => {
  const jurassic = strata.find(
    stratum => stratum.division.name === 'Late Jurassic'
  )!;

  it('reads the younger edge at the top of a block', () => {
    expect(stratumTime(jurassic, 0)).toBe(145_000_000);
  });

  it('reads the older edge at the bottom of a block', () => {
    expect(stratumTime(jurassic, 1)).toBe(163_500_000);
  });

  it('interpolates in between', () => {
    expect(stratumTime(jurassic, 0.5)).toBe(154_250_000);
  });
});

describe('eonJumps', () => {
  it('points at the first block of each eon, in order', () => {
    const jumps = eonJumps(strata);

    expect(jumps.map(jump => jump.eon)).toEqual([
      'Phanerozoic',
      'Proterozoic',
      'Archean',
      'Hadean',
    ]);
    expect(jumps[0].index).toBe(0);

    for (const jump of jumps) {
      expect(strata[jump.index].eon).toBe(jump.eon);
      if (jump.index > 0) {
        expect(strata[jump.index - 1].eon).not.toBe(jump.eon);
      }
    }
  });
});
