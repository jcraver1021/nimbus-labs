import {
  GEOLOGIC_PERIODS,
  resolveEarthState,
  type GeologicPeriod,
  type ResolvedEarthState,
} from '@nimbus-labs/deeptime';

/**
 * Builds the dive's spine: one block per division, ordered from the present
 * downward, at the finest granularity the time scale actually defines.
 *
 * The geologic time scale overlaps by design — an eon, its eras, their
 * periods, and their epochs are all separate divisions covering the same
 * years — so a scroll through it has to pick one level per stretch of time.
 * We take epochs where they exist (all of the Phanerozoic bar the
 * Carboniferous, which is divided into sub-epochs instead) and fall back
 * through period, era, and eon for the Precambrian, where nothing finer is
 * defined.
 */

/** Levels to draw a block from, finest first. */
const LEVEL_PREFERENCE: GeologicPeriod['level'][] = [
  'epoch',
  'sub-epoch',
  'period',
  'era',
  'eon',
];

/** Years ago that Earth formed — where the dive bottoms out. */
export const EARTH_FORMED_YEARS_AGO = 4_600_000_000;

/** Fallback band colour for a division the time scale leaves uncoloured. */
const DEFAULT_COLOR = '#bdbdbd';

export interface DiveStratum {
  division: GeologicPeriod;
  /** The divisions containing this one, coarsest first (eon → era → …). */
  ancestry: string[];
  /** Resolved state of the planet during this division, if any is known. */
  earthState: ResolvedEarthState | null;
  /** The eon this block belongs to, which is itself for an eon-level block. */
  eon: string;
  color: string;
}

/** The finest-level division covering a given time, or null past the end. */
function finestDivisionAt(yearsAgo: number): GeologicPeriod | null {
  for (const level of LEVEL_PREFERENCE) {
    const division = GEOLOGIC_PERIODS.find(
      candidate =>
        candidate.level === level &&
        candidate.start <= yearsAgo &&
        candidate.end > yearsAgo
    );
    if (division) return division;
  }

  return null;
}

function toStratum(division: GeologicPeriod): DiveStratum {
  const ancestry = [
    division.eon,
    division.era,
    division.period,
    division.epoch,
    division.subEpoch,
  ].filter((name): name is string => name !== undefined);

  return {
    division,
    ancestry,
    earthState: resolveEarthState(division),
    eon: division.eon ?? division.name,
    color: division.color ?? DEFAULT_COLOR,
  };
}

/**
 * Walks from the present back to Earth's formation, taking the finest
 * division available at each step and jumping to its far edge.
 */
export function buildDiveSpine(): DiveStratum[] {
  const strata: DiveStratum[] = [];

  let yearsAgo = 0;
  while (yearsAgo < EARTH_FORMED_YEARS_AGO) {
    const division = finestDivisionAt(yearsAgo);
    if (!division) break;

    strata.push(toStratum(division));
    yearsAgo = division.end;
  }

  return strata;
}

/**
 * How long ago a point partway down a block is, where `fraction` runs from 0
 * at its top (younger) edge to 1 at its bottom (older) edge.
 */
export function stratumTime(stratum: DiveStratum, fraction: number): number {
  const {start, end} = stratum.division;
  return start + fraction * (end - start);
}

export interface EonJump {
  eon: string;
  /** Index of the first block in that eon. */
  index: number;
}

/**
 * The first block of each eon, for the jump buttons — the coarsest useful
 * targets in a scroll that is otherwise 48 blocks long.
 */
export function eonJumps(strata: DiveStratum[]): EonJump[] {
  const jumps: EonJump[] = [];

  strata.forEach((stratum, index) => {
    if (jumps.some(jump => jump.eon === stratum.eon)) return;
    jumps.push({eon: stratum.eon, index});
  });

  return jumps;
}
