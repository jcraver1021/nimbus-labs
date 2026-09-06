# Earth State

What the planet itself was like at each division of the
[geologic time scale](GEOLOGIC_TIME_SCALE.md): how much of it was underwater, what the land was
arranged into, what the air was made of, how warm it was, how long a day lasted, and how big the
Moon looked.

Two very different kinds of data live here, and it's worth knowing which is which:

- **Curated** (`earth-state.ts`) — hand-recorded estimates per division, drawn from the standard
  compilations. There is no way to derive these; someone has to read the literature and write them
  down.
- **Derived** (`earth-astronomy.ts`) — day length, the number of days in a year, the Moon's
  distance, and the Moon's angular diameter, computed from one empirical curve plus conservation of
  angular momentum.

## Curated state

```typescript
{
  division: string;                  // A name from GEOLOGIC_PERIODS
  headline?: string;                 // The one defining feature of the division
  oceanCoverage?: number;            // Fraction of the surface under water, 0-1
  seaLevelVsTodayMeters?: number;    // Global mean sea level relative to today
  continents?: string[];             // Major landmasses and oceans
  atmosphere?: {
    o2Percent?: number;              // By volume; today 20.9
    n2Percent?: number;              // By volume; today 78.1
    co2Ppm?: number;                 // By volume; pre-industrial 280
    ch4Ppm?: number;                 // By volume; pre-industrial 0.7
    note?: string;
  };
  meanSurfaceTemperatureC?: number;  // Global mean; today about 14
  notes?: string[];
}
```

Every field but `division` is optional, and entries are deliberately sparse. Each fact is recorded
at whatever level of the hierarchy it actually varies at — sea level and CO2 by epoch, continents
usually by period, and the whole physical state by era or eon in the Precambrian.
`resolveEarthState` then fills a division's gaps from the divisions containing it:

```typescript
import {resolveEarthState, getPeriodAtTime} from '@nimbus-labs/deeptime';

const lateJurassic = getPeriodAtTime(150_000_000);
const state = resolveEarthState(lateJurassic!);

state.seaLevelVsTodayMeters; // 140 — recorded for the Late Jurassic itself
state.continents; // ['Laurasia', 'Gondwana', ...] — inherited from the Jurassic
state.resolvedFrom; // ['Late Jurassic', 'Jurassic'] — which entries contributed
```

Atmospheres merge field by field, so an epoch can override CO2 while still inheriting its period's
oxygen. `resolvedFrom` lists only the divisions that actually contributed a field, which is what
lets a caller tell the reader which numbers are specific to what they're looking at.

Use `getEarthState(name)` instead when you want one entry exactly as recorded, with no inheritance.

### Sources

Values are best estimates, not measurements, drawn from:

- **Sea level** — Haq & Schutter (2008)
- **CO2** — Berner's GEOCARB, and Royer's compilations
- **Oxygen** — Berner & Canfield
- **Paleogeography and mean temperature** — Scotese's reconstructions

Uncertainty grows sharply with age. Phanerozoic numbers are good to a few tens of percent; Archean
and Hadean numbers to a factor of a few at best. Anything displaying them should say so.

## Derived astronomy

Tidal friction has been slowing Earth's spin and pushing the Moon outward since the Moon formed, so
the day, the year's day count, and the Moon's apparent size are all functions of how far back you
look.

```typescript
import {getSkyState} from '@nimbus-labs/deeptime';

getSkyState(0);
// dayLengthHours: 24, daysPerYear: 365.3, lunarDistanceKm: 384_400,
// moonAngularDiameterDegrees: 0.518, moonAngularDiameterVsToday: 1

getSkyState(4_500_000_000);
// dayLengthHours: 5, daysPerYear: 1_753, lunarDistanceKm: ~19_000,
// moonAngularDiameterDegrees: ~10.4, moonAngularDiameterVsToday: ~20
```

Only day length is empirical: a curve interpolated between published anchor points from tidal
rhythmites, cyclostratigraphy, and eclipse records — including the long Proterozoic plateau of
Bartlett & Stevenson (2016), the 1400 Ma point of Meyers & Malinverno (2018), and the 620 Ma point
of Williams (2000). Values before about 3 Ga are extrapolations with error bars measured in hours.

Everything else follows from conservation of the Earth-Moon system's angular momentum: whatever
extra spin Earth had, the Moon's orbit was missing, which puts it closer in. The total is derived
from present-day values, so the model reproduces today's Moon exactly at time zero — and, as a
sanity check on the far end, keeps the newborn Moon outside the Roche limit.

The individual pieces are also exported on their own: `getDayLengthHours`, `getDaysPerYear`,
`getLunarDistanceKm`, and `getMoonAngularDiameterDegrees`. All of them accept a `TimePoint`, so an
uncertain date works as well as an exact one.
