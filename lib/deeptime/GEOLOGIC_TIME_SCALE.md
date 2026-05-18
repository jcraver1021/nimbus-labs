# Geologic Time Scale

Comprehensive geologic time scale based on the International Commission on Stratigraphy (2024).

## Hierarchy

The geologic time scale is organized hierarchically from largest to smallest:

```text
Eon
└── Era
    └── Period
        └── Epoch
            └── Sub-Epoch (where applicable)
                └── Age
                    └── Sub-Age (where applicable)
```

### Example Hierarchy

```text
Phanerozoic (Eon)
└── Cenozoic (Era)
    └── Quaternary (Period)
        └── Holocene (Epoch)
            ├── Late Holocene (Sub-Epoch)
            │   └── Meghalayan (Age)
            ├── Middle Holocene (Sub-Epoch)
            │   └── Northgrippian (Age)
            └── Early Holocene (Sub-Epoch)
                └── Greenlandian (Age)
```

## Coverage

### Eons

- **Phanerozoic**: 0 - 541 Ma (current eon, "visible life")
- **Proterozoic**: 541 Ma - 2.5 Ga
- **Archean**: 2.5 - 4.0 Ga
- **Hadean**: 4.0 - 4.6 Ga (formation of Earth)

### Phanerozoic Eras

- **Cenozoic**: 0 - 66 Ma (Age of Mammals)
- **Mesozoic**: 66 - 252 Ma (Age of Reptiles)
- **Paleozoic**: 252 - 541 Ma (Ancient Life)

### Major Periods

- Quaternary, Neogene, Paleogene (Cenozoic)
- Cretaceous, Jurassic, Triassic (Mesozoic)
- Permian, Carboniferous, Devonian, Silurian, Ordovician, Cambrian (Paleozoic)
- And many more...

## Data Structure

Each time division includes:

```typescript
{
  name: string;           // e.g., "Holocene"
  start: number;          // Years ago (11,700 for Holocene)
  end: number;            // Years ago (0 for Holocene)
  level: 'eon' | 'era' | 'period' | 'epoch' | 'sub-epoch' | 'age' | 'sub-age';
  eon?: string;           // Parent eon
  era?: string;           // Parent era
  period?: string;        // Parent period
  epoch?: string;         // Parent epoch
  subEpoch?: string;      // Parent sub-epoch
  color?: string;         // Standard color code
}
```

## Helper Functions

### Query by Level

```typescript
import {getEons, getEras, getPeriods, getEpochs, getAges} from '@nimbus-labs/deeptime';

// Get all eons
const eons = getEons();

// Get all eras (optionally filter by eon)
const allEras = getEras();
const cenozoicEras = getEras('Phanerozoic');

// Get all periods (optionally filter by era)
const allPeriods = getPeriods();
const cenozoicPeriods = getPeriods('Cenozoic');

// Get all epochs (optionally filter by period)
const allEpochs = getEpochs();
const quaternaryEpochs = getEpochs('Quaternary');

// Get all ages (optionally filter by epoch)
const allAges = getAges();
const holoceneAges = getAges('Holocene');
```

### Query by Time

```typescript
import {getPeriodAtTime, getPeriodsInRange} from '@nimbus-labs/deeptime';

// What geologic division was 66 million years ago?
const period = getPeriodAtTime(66_000_000);
// Returns: Maastrichtian (age), Late Cretaceous (epoch), etc.

// What divisions span 100-200 million years ago?
const periods = getPeriodsInRange(200_000_000, 100_000_000);
```

### Query by Level Type

```typescript
import {getPeriodsByLevel} from '@nimbus-labs/deeptime';

// Get all entries at a specific level
const allPeriods = getPeriodsByLevel('period');
const allEpochs = getPeriodsByLevel('epoch');
const allAges = getPeriodsByLevel('age');
```

## Time Formatting

```typescript
import {formatTimeYearsAgo} from '@nimbus-labs/deeptime';

formatTimeYearsAgo(300_000); // "300.0k years ago"
formatTimeYearsAgo(6_000_000); // "6.0M years ago"
formatTimeYearsAgo(66_000_000); // "66.0M years ago"
formatTimeYearsAgo(4_600_000_000); // "4.60B years ago"
```

## Colors

Standard colors follow International Commission on Stratigraphy conventions:

- Cenozoic periods: Yellow/orange tones
- Mesozoic periods: Green/teal tones
- Paleozoic periods: Green/blue tones
- Proterozoic: Pink/purple tones
- Archean: Deep pink tones
- Hadean: Dark red

## Notes

- All times are in "years ago" (before present)
- 1 Ma = 1 million years ago = 1,000,000
- 1 Ga = 1 billion years ago = 1,000,000,000
- Boundaries are based on ICS 2024 standards
- Some sub-epochs and sub-ages are included where formally defined
