import {
  formatTimeYearsAgo,
  type ResolvedEarthState,
  type SkyState,
} from '@nimbus-labs/deeptime';

/**
 * Turns the library's numbers into the strings the side panel shows.
 *
 * Kept separate from the panel itself so the wording and the unit handling —
 * which is where the mistakes live — can be tested without rendering
 * anything.
 */

/** Present-day values, used for the "compared to today" halves of facts. */
const TODAY = {
  oceanCoverage: 0.71,
  meanSurfaceTemperatureC: 14,
};

export interface EarthFact {
  label: string;
  /** The headline value, e.g. "71% of the surface". */
  value: string;
  /** A list rendered as chips instead of a single value. */
  items?: string[];
  /** Context for the value, e.g. how it compares to today. */
  detail?: string;
}

function formatSigned(value: number, unit: string): string {
  const rounded = Math.round(value);
  if (rounded === 0) return 'the same as today';
  return `${Math.abs(rounded)} ${unit} ${rounded > 0 ? 'above' : 'below'} today`;
}

function formatDistanceKm(km: number): string {
  const thousands = Math.round(km / 1_000) * 1_000;
  return `${thousands.toLocaleString()} km`;
}

function formatMultiple(ratio: number): string {
  if (Math.abs(ratio - 1) < 0.05) return 'about the same width as today';
  if (ratio > 1) return `${ratio.toFixed(1)}× as wide as today`;
  return `${(1 / ratio).toFixed(1)}× narrower than today`;
}

function atmosphereItems(
  atmosphere: NonNullable<ResolvedEarthState['atmosphere']>
): string[] {
  const items: string[] = [];

  if (atmosphere.o2Percent !== undefined) {
    // Trace-level oxygen would round away entirely at one decimal place.
    const percent =
      atmosphere.o2Percent > 0 && atmosphere.o2Percent < 0.1
        ? atmosphere.o2Percent.toPrecision(1)
        : atmosphere.o2Percent.toFixed(1);
    items.push(`${percent}% O₂`);
  }
  if (atmosphere.co2Ppm !== undefined) {
    items.push(
      atmosphere.co2Ppm >= 10_000
        ? `${(atmosphere.co2Ppm / 10_000).toFixed(1)}% CO₂`
        : `${atmosphere.co2Ppm.toLocaleString()} ppm CO₂`
    );
  }
  if (atmosphere.n2Percent !== undefined) {
    items.push(`${atmosphere.n2Percent.toFixed(0)}% N₂`);
  }
  if (atmosphere.ch4Ppm !== undefined) {
    items.push(`${atmosphere.ch4Ppm.toLocaleString()} ppm CH₄`);
  }

  return items;
}

/**
 * Every fact the panel can show about one moment, in reading order. Facts
 * with nothing recorded behind them are left out rather than shown empty.
 */
export function buildEarthFacts(
  state: ResolvedEarthState | null,
  sky: SkyState
): EarthFact[] {
  const facts: EarthFact[] = [];

  if (state?.oceanCoverage !== undefined) {
    const percent = Math.round(state.oceanCoverage * 100);
    const todayPercent = Math.round(TODAY.oceanCoverage * 100);
    facts.push({
      label: 'Water coverage',
      value: `${percent}% of the surface`,
      detail:
        percent === todayPercent
          ? `About the same as today’s ${todayPercent}%`
          : `Today: ${todayPercent}%`,
    });
  }

  if (state?.seaLevelVsTodayMeters !== undefined) {
    facts.push({
      label: 'Sea level',
      value: formatSigned(state.seaLevelVsTodayMeters, 'm'),
    });
  }

  if (state?.continents !== undefined) {
    facts.push({
      label: 'Land',
      value: `${state.continents.length} major landmasses and oceans`,
      items: state.continents,
    });
  }

  if (state?.atmosphere !== undefined) {
    const items = atmosphereItems(state.atmosphere);
    if (items.length > 0) {
      facts.push({
        label: 'Atmosphere',
        value: items.join(' · '),
        items,
        detail: state.atmosphere.note,
      });
    }
  }

  if (state?.meanSurfaceTemperatureC !== undefined) {
    const difference =
      state.meanSurfaceTemperatureC - TODAY.meanSurfaceTemperatureC;
    facts.push({
      label: 'Mean surface temperature',
      value: `${state.meanSurfaceTemperatureC} °C`,
      detail:
        Math.abs(difference) < 1
          ? `About today’s ${TODAY.meanSurfaceTemperatureC} °C`
          : `${Math.abs(Math.round(difference))} °C ${
              difference > 0 ? 'warmer' : 'cooler'
            } than today`,
    });
  }

  facts.push({
    label: 'Day length',
    value: `${sky.dayLengthHours.toFixed(1)} hours`,
    detail: `${Math.round(sky.daysPerYear).toLocaleString()} days in a year`,
  });

  facts.push({
    label: 'Moon',
    value: `${sky.moonAngularDiameterDegrees.toFixed(2)}° across`,
    detail: `${formatDistanceKm(sky.lunarDistanceKm)} away — ${formatMultiple(
      sky.moonAngularDiameterVsToday
    )}`,
  });

  return facts;
}

/** How long a division lasted, phrased for a caption. */
export function formatDuration(years: number): string {
  if (years < 1_000) return `${years.toLocaleString()} years`;
  if (years < 1_000_000) return `${(years / 1_000).toFixed(1)}k years`;
  if (years < 1_000_000_000) return `${(years / 1_000_000).toFixed(1)}M years`;
  return `${(years / 1_000_000_000).toFixed(2)}B years`;
}

/**
 * The time span of a division, phrased for a heading: "145–201 Ma", or years
 * for the divisions too recent for that to mean anything.
 */
export function formatSpan(start: number, end: number): string {
  return `${formatTimeYearsAgo(start)} – ${formatTimeYearsAgo(end)}`;
}

/**
 * Note explaining that some values describe a broader division than the one
 * on screen, or null when they all describe this one.
 */
export function formatInheritance(
  state: ResolvedEarthState | null
): string | null {
  if (!state) return null;

  const inherited = state.resolvedFrom.filter(name => name !== state.division);
  if (inherited.length === 0) return null;

  return `Some values are recorded for the whole ${inherited.join(', then ')}.`;
}
