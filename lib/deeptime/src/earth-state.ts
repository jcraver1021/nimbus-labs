import type {GeologicPeriod, TimePoint} from './temporal-graph';
import {getPeriodAtTime} from './geologic-time-scale';

/**
 * The state of the planet itself across the geologic time scale — how much of
 * it was underwater, what the land was arranged into, what the air was made
 * of, and how warm it was.
 *
 * Values are best estimates drawn from the standard compilations (Haq &
 * Schutter 2008 for sea level, Berner's GEOCARB and Royer for CO2, Berner &
 * Canfield for oxygen, Scotese's reconstructions for paleogeography and mean
 * temperature) and are meant to be read as "roughly this", not as
 * measurements. Uncertainty grows sharply with age: Phanerozoic numbers are
 * good to a few tens of percent, Archean and Hadean numbers to a factor of a
 * few at best.
 *
 * Entries are sparse on purpose. Most fields are recorded at whatever level of
 * the hierarchy they actually vary at — sea level and CO2 by epoch, continents
 * usually by period — and `resolveEarthState` fills a division's gaps from its
 * parents, so a caller asking about the Late Jurassic gets Jurassic-wide
 * paleogeography without that having to be repeated on all three of its
 * epochs.
 */

export interface AtmosphericComposition {
  /** Molecular oxygen, percent of the atmosphere by volume (today: 20.9). */
  o2Percent?: number;
  /** Nitrogen, percent by volume (today: 78.1). */
  n2Percent?: number;
  /** Carbon dioxide, parts per million by volume (pre-industrial: 280). */
  co2Ppm?: number;
  /** Methane, parts per million by volume (pre-industrial: 0.7). */
  ch4Ppm?: number;
  /** Anything the numbers alone don't convey. */
  note?: string;
}

export interface EarthState {
  /** Name of the {@link GeologicPeriod} division this describes. */
  division: string;
  /** The one defining feature of the division, in a sentence. */
  headline?: string;
  /** Fraction of Earth's surface under water, 0-1 (today: 0.71). */
  oceanCoverage?: number;
  /** Global mean sea level relative to today, in meters. */
  seaLevelVsTodayMeters?: number;
  /** Major landmasses and oceans, named as the literature names them. */
  continents?: string[];
  atmosphere?: AtmosphericComposition;
  /** Global mean surface temperature, °C (today: about 14). */
  meanSurfaceTemperatureC?: number;
  /** Further facts worth showing next to the numbers. */
  notes?: string[];
}

export interface ResolvedEarthState extends EarthState {
  /**
   * Divisions that contributed a field, finest first — so a caller can say
   * which numbers are specific to the division asked about and which are
   * inherited from a broader one.
   */
  resolvedFrom: string[];
}

export const EARTH_STATES: EarthState[] = [
  // ========== PHANEROZOIC EON ==========

  {
    division: 'Phanerozoic',
    headline:
      'Visible life: the eon of shells, bones, forests, and footprints.',
    oceanCoverage: 0.75,
    atmosphere: {o2Percent: 20, n2Percent: 78, co2Ppm: 1_500},
    meanSurfaceTemperatureC: 19,
  },

  // --- CENOZOIC ERA ---

  {
    division: 'Cenozoic',
    headline: 'The long cooling that ends in ice ages, grasslands, and us.',
    oceanCoverage: 0.71,
    continents: [
      'Africa',
      'Antarctica',
      'Asia',
      'Australia',
      'Europe',
      'North America',
      'South America',
    ],
    atmosphere: {o2Percent: 21, n2Percent: 78, ch4Ppm: 0.7},
    meanSurfaceTemperatureC: 18,
  },

  // Quaternary Period
  {
    division: 'Holocene',
    headline:
      'The interglacial that all of recorded human history fits inside.',
    seaLevelVsTodayMeters: 0,
    atmosphere: {
      co2Ppm: 280,
      ch4Ppm: 0.7,
      note: 'Pre-industrial values; industrial emissions have since pushed CO2 past 420 ppm.',
    },
    meanSurfaceTemperatureC: 14,
    notes: [
      'Sea level rose about 120 m over the 10,000 years before it, as the last ice sheets melted.',
      'Land ice is confined to Greenland, Antarctica, and mountain glaciers.',
    ],
  },
  {
    division: 'Pleistocene',
    headline:
      'Ice ages on a 100,000-year beat, with ice sheets reaching the mid-latitudes.',
    oceanCoverage: 0.7,
    seaLevelVsTodayMeters: -60,
    atmosphere: {
      co2Ppm: 230,
      ch4Ppm: 0.5,
      note: 'CO2 cycled between 180 ppm at glacial maxima and 280 ppm in interglacials.',
    },
    meanSurfaceTemperatureC: 12,
    notes: [
      'At the last glacial maximum, enough water was locked up in ice to drop sea level 125 m and join Britain to Europe.',
    ],
  },
  {
    division: 'Quaternary',
    headline: 'The ice age we are still in, punctuated by warm interglacials.',
    oceanCoverage: 0.71,
    continents: [
      'Africa',
      'Antarctica',
      'Asia',
      'Australia',
      'Europe',
      'North America',
      'South America',
    ],
    atmosphere: {o2Percent: 20.9, n2Percent: 78.1},
    meanSurfaceTemperatureC: 13,
  },

  // Neogene Period
  {
    division: 'Pliocene',
    headline:
      'The Isthmus of Panama closes, rerouting the oceans, and the Arctic freezes over.',
    seaLevelVsTodayMeters: 25,
    atmosphere: {co2Ppm: 400},
    meanSurfaceTemperatureC: 17,
    notes: [
      'The last time CO2 sat near today’s level for long: sea level stood some 20 m higher.',
    ],
  },
  {
    division: 'Miocene',
    headline:
      'Grasslands spread across drying continents and Antarctic ice becomes permanent.',
    seaLevelVsTodayMeters: 30,
    atmosphere: {co2Ppm: 400},
    meanSurfaceTemperatureC: 18,
    notes: [
      'The Mediterranean dried almost completely at the end of it — the Messinian salinity crisis.',
    ],
  },
  {
    division: 'Neogene',
    oceanCoverage: 0.71,
    continents: [
      'Africa',
      'Antarctica',
      'Asia (India welded on, raising the Himalaya)',
      'Australia',
      'Europe',
      'North America',
      'South America',
    ],
    atmosphere: {o2Percent: 21, n2Percent: 78},
    meanSurfaceTemperatureC: 18,
  },

  // Paleogene Period
  {
    division: 'Oligocene',
    headline:
      'Global cooling takes hold and Antarctica grows its first permanent ice sheet.',
    oceanCoverage: 0.72,
    seaLevelVsTodayMeters: 30,
    atmosphere: {co2Ppm: 500},
    meanSurfaceTemperatureC: 17,
  },
  {
    division: 'Eocene',
    headline:
      'The hottest stretch of the last 66 million years — palms and crocodiles in the Arctic.',
    oceanCoverage: 0.74,
    seaLevelVsTodayMeters: 80,
    atmosphere: {co2Ppm: 1_000},
    meanSurfaceTemperatureC: 22,
    notes: [
      'The Early Eocene Climatic Optimum reached a global mean near 27 °C with no ice at either pole.',
      'India was still an island, closing the last of the Tethys Ocean.',
    ],
  },
  {
    division: 'Paleocene',
    headline:
      'The world just after the asteroid: no large dinosaurs, forests refilling, mammals small.',
    seaLevelVsTodayMeters: 100,
    atmosphere: {co2Ppm: 600},
    meanSurfaceTemperatureC: 24,
  },
  {
    division: 'Paleogene',
    oceanCoverage: 0.75,
    continents: [
      'North America',
      'Greenland',
      'Eurasia',
      'Africa',
      'India (closing on Asia)',
      'South America',
      'Australia-Antarctica (separating)',
      'Tethys Ocean (closing)',
    ],
    atmosphere: {o2Percent: 22, n2Percent: 77},
    meanSurfaceTemperatureC: 21,
  },

  // --- MESOZOIC ERA ---

  {
    division: 'Mesozoic',
    headline:
      'A warm, ice-free world ruled by reptiles, from Pangaea to the modern coastlines.',
    oceanCoverage: 0.78,
    atmosphere: {o2Percent: 22, n2Percent: 76, co2Ppm: 1_600},
    meanSurfaceTemperatureC: 23,
  },

  // Cretaceous Period
  {
    division: 'Late Cretaceous',
    headline:
      'Peak flooding — shallow seas cover a third of today’s land — ending at Chicxulub.',
    oceanCoverage: 0.85,
    seaLevelVsTodayMeters: 250,
    atmosphere: {co2Ppm: 1_000},
    meanSurfaceTemperatureC: 25,
    notes: [
      'The Western Interior Seaway split North America from the Arctic to the Gulf of Mexico.',
    ],
  },
  {
    division: 'Early Cretaceous',
    headline:
      'The South Atlantic opens as Gondwana splits, and flowering plants appear.',
    seaLevelVsTodayMeters: 150,
    atmosphere: {co2Ppm: 1_500},
    meanSurfaceTemperatureC: 22,
  },
  {
    division: 'Cretaceous',
    oceanCoverage: 0.82,
    continents: [
      'Laurasia',
      'Africa',
      'South America',
      'India',
      'Australia-Antarctica',
      'Tethys Ocean',
    ],
    atmosphere: {o2Percent: 26, n2Percent: 73},
    notes: ['No polar ice caps at all: forests grew at both poles.'],
  },

  // Jurassic Period
  {
    division: 'Late Jurassic',
    headline:
      'Warm shallow seas ring every continent, and sauropods reach their largest.',
    seaLevelVsTodayMeters: 140,
  },
  {
    division: 'Middle Jurassic',
    headline: 'Pangaea’s breakup accelerates and the central Atlantic floods.',
    seaLevelVsTodayMeters: 100,
  },
  {
    division: 'Early Jurassic',
    headline:
      'Recovery from the end-Triassic extinction under a CO2-heavy sky.',
    seaLevelVsTodayMeters: 60,
    atmosphere: {co2Ppm: 2_500},
    meanSurfaceTemperatureC: 23,
  },
  {
    division: 'Jurassic',
    oceanCoverage: 0.78,
    continents: ['Laurasia', 'Gondwana', 'Tethys Ocean', 'Panthalassa Ocean'],
    atmosphere: {o2Percent: 26, n2Percent: 73, co2Ppm: 1_950},
    meanSurfaceTemperatureC: 22,
  },

  // Triassic Period
  {
    division: 'Late Triassic',
    headline:
      'Pangaea begins to rift, and the first dinosaurs and first mammals appear.',
    seaLevelVsTodayMeters: 60,
  },
  {
    division: 'Middle Triassic',
    headline: 'Life re-diversifies, and reptiles return to the sea.',
  },
  {
    division: 'Early Triassic',
    headline:
      'The hottest ocean in the record, in the wake of the Great Dying.',
    atmosphere: {co2Ppm: 2_500},
    meanSurfaceTemperatureC: 30,
    notes: [
      'Tropical sea surface temperatures near 40 °C left the equator largely uninhabitable.',
    ],
  },
  {
    division: 'Triassic',
    oceanCoverage: 0.7,
    seaLevelVsTodayMeters: 40,
    continents: ['Pangaea', 'Panthalassa Ocean', 'Paleo-Tethys Ocean'],
    atmosphere: {o2Percent: 16, n2Percent: 82, co2Ppm: 1_750},
    meanSurfaceTemperatureC: 24,
    notes: [
      'One landmass from pole to pole gave the interior a brutally seasonal desert climate.',
      'The lowest atmospheric oxygen of the Phanerozoic — about three-quarters of today’s.',
    ],
  },

  // --- PALEOZOIC ERA ---

  {
    division: 'Paleozoic',
    headline:
      'From the first shelled animals to the first forests, ending in the largest extinction of all.',
    oceanCoverage: 0.8,
    atmosphere: {o2Percent: 18, n2Percent: 79, co2Ppm: 3_000},
    meanSurfaceTemperatureC: 19,
  },

  // Permian Period
  {
    division: 'Lopingian',
    headline:
      'Ends in the Great Dying, the largest extinction in Earth’s history.',
    atmosphere: {o2Percent: 15, co2Ppm: 1_500},
    meanSurfaceTemperatureC: 22,
    notes: [
      'The Siberian Traps erupted through coal beds, and roughly 80% of marine species died out.',
    ],
  },
  {
    division: 'Guadalupian',
    headline:
      'The great coal swamps are gone and deserts spread across Pangaea’s interior.',
  },
  {
    division: 'Cisuralian',
    headline:
      'The tail end of a 60-million-year ice age, with glaciers across southern Pangaea.',
    seaLevelVsTodayMeters: -50,
    atmosphere: {o2Percent: 30, co2Ppm: 400},
    meanSurfaceTemperatureC: 14,
  },
  {
    division: 'Permian',
    oceanCoverage: 0.68,
    seaLevelVsTodayMeters: -20,
    continents: ['Pangaea', 'Panthalassa Ocean', 'Paleo-Tethys Ocean'],
    atmosphere: {o2Percent: 25, n2Percent: 74, co2Ppm: 900},
    meanSurfaceTemperatureC: 18,
    notes: [
      'Pangaea’s assembly completes: a single landmass from pole to pole.',
    ],
  },

  // Carboniferous Period
  {
    division: 'Pennsylvanian',
    headline:
      'Coal swamps at their peak and oxygen at its all-time high — dragonflies with two-foot wingspans.',
    seaLevelVsTodayMeters: 50,
    atmosphere: {o2Percent: 35, co2Ppm: 300},
    meanSurfaceTemperatureC: 12,
    notes: [
      'Wildfires burned readily even in wet peat at these oxygen levels.',
    ],
  },
  {
    division: 'Mississippian',
    headline:
      'Warm shallow seas thick with crinoids, before the ice sheets get going.',
    seaLevelVsTodayMeters: 120,
    atmosphere: {o2Percent: 27, co2Ppm: 800},
    meanSurfaceTemperatureC: 16,
  },
  {
    division: 'Carboniferous',
    oceanCoverage: 0.7,
    seaLevelVsTodayMeters: 80,
    continents: [
      'Laurussia',
      'Gondwana (colliding with Laurussia)',
      'Siberia',
      'Rheic Ocean (closing)',
    ],
    atmosphere: {o2Percent: 32, n2Percent: 67, co2Ppm: 350},
    meanSurfaceTemperatureC: 14,
    notes: [
      'The highest oxygen levels in Earth’s history, which is why insects grew so large.',
      'Equatorial peat swamps laid down most of the world’s coal.',
    ],
  },

  // Devonian Period
  {
    division: 'Late Devonian',
    headline:
      'The first true forests take root, and their weathering triggers mass extinctions in the sea.',
    atmosphere: {o2Percent: 20, co2Ppm: 900},
    meanSurfaceTemperatureC: 19,
  },
  {
    division: 'Middle Devonian',
    headline:
      'The largest reef systems of the entire Phanerozoic ring the shallow seas.',
  },
  {
    division: 'Early Devonian',
    headline:
      'Low-growing plants and arthropods spread inland from the shoreline.',
    atmosphere: {co2Ppm: 3_000},
    meanSurfaceTemperatureC: 21,
  },
  {
    division: 'Devonian',
    oceanCoverage: 0.79,
    seaLevelVsTodayMeters: 150,
    continents: ['Laurussia (Euramerica)', 'Gondwana', 'Siberia'],
    atmosphere: {o2Percent: 18, n2Percent: 79, co2Ppm: 2_200},
    meanSurfaceTemperatureC: 20,
    notes: [
      'Forests appear and spread, pulling CO2 down faster than at any earlier time.',
    ],
  },

  // Silurian Period
  {
    division: 'Pridoli',
    headline: 'Plants with true stems and vascular tissue cover the coasts.',
  },
  {
    division: 'Ludlow',
    headline:
      'Jawed fish diversify while the first millipedes crawl out of the water.',
  },
  {
    division: 'Wenlock',
    headline:
      'Reef-rich seas, and the oldest well-known vascular land plant, Cooksonia.',
  },
  {
    division: 'Llandovery',
    headline:
      'Recovery from the end-Ordovician extinction as the glaciers melt back.',
    seaLevelVsTodayMeters: 120,
    meanSurfaceTemperatureC: 18,
  },
  {
    division: 'Silurian',
    oceanCoverage: 0.83,
    seaLevelVsTodayMeters: 180,
    continents: [
      'Laurussia (forming as Laurentia and Baltica collide)',
      'Gondwana',
      'Avalonia',
      'Siberia',
      'Panthalassic Ocean',
    ],
    atmosphere: {o2Percent: 17, n2Percent: 80, co2Ppm: 4_500},
    meanSurfaceTemperatureC: 22,
    notes: [
      'Continental flooding near its Phanerozoic peak: land is scarce and low.',
    ],
  },

  // Ordovician Period
  {
    division: 'Late Ordovician',
    headline:
      'Gondwana drifts over the South Pole and the glaciers it grows drive a mass extinction.',
    seaLevelVsTodayMeters: 150,
    atmosphere: {co2Ppm: 3_000},
    meanSurfaceTemperatureC: 13,
  },
  {
    division: 'Middle Ordovician',
    headline:
      'The Great Ordovician Biodiversification: reefs, plankton, and the first jawed fish.',
  },
  {
    division: 'Early Ordovician',
    headline: 'A warm, shallow, almost entirely marine world.',
    seaLevelVsTodayMeters: 180,
    meanSurfaceTemperatureC: 22,
  },
  {
    division: 'Ordovician',
    oceanCoverage: 0.85,
    seaLevelVsTodayMeters: 200,
    continents: [
      'Gondwana',
      'Laurentia',
      'Baltica',
      'Siberia',
      'Avalonia',
      'Iapetus Ocean',
    ],
    atmosphere: {o2Percent: 14, n2Percent: 82, co2Ppm: 4_200},
    meanSurfaceTemperatureC: 20,
    notes: [
      'The highest sea level of the Phanerozoic — shallow seas flooded nearly every continent.',
      'Land was bare rock and microbial crust; the first non-vascular plants appear only late.',
    ],
  },

  // Cambrian Period
  {
    division: 'Furongian',
    headline:
      'Trilobite-dominated seas, interrupted by repeated low-oxygen extinction pulses.',
  },
  {
    division: 'Miaolingian',
    headline:
      'The Burgess Shale fauna: every major animal body plan is already present.',
  },
  {
    division: 'Terreneuvian',
    headline:
      'The Cambrian explosion — burrows, shells, and the first predators, within a few million years.',
  },
  {
    division: 'Cambrian',
    oceanCoverage: 0.84,
    seaLevelVsTodayMeters: 150,
    continents: [
      'Gondwana',
      'Laurentia',
      'Baltica',
      'Siberia',
      'Panthalassic Ocean',
    ],
    atmosphere: {o2Percent: 13, n2Percent: 83, co2Ppm: 5_000},
    meanSurfaceTemperatureC: 22,
    notes: [
      'Oxygen reaches roughly two-thirds of today’s level — enough, for the first time, for large mobile animals.',
      'The continents are bare rock, sand, and microbial mats; nothing lives on land.',
    ],
  },

  // ========== PROTEROZOIC EON ==========

  {
    division: 'Proterozoic',
    headline:
      'Oxygen arrives, cells grow complex, and the continents learn to assemble into supercontinents.',
    oceanCoverage: 0.85,
    continents: ['a shifting set of cratons'],
    atmosphere: {o2Percent: 2, n2Percent: 90, co2Ppm: 20_000, ch4Ppm: 10},
    meanSurfaceTemperatureC: 15,
  },

  {
    division: 'Neoproterozoic',
    headline: 'Global glaciations, then the first animals.',
    atmosphere: {o2Percent: 4, co2Ppm: 8_000},
  },
  {
    division: 'Ediacaran',
    headline:
      'The first large soft-bodied animals, in a world just emerging from global glaciation.',
    oceanCoverage: 0.85,
    seaLevelVsTodayMeters: 100,
    continents: [
      'Gondwana (assembling)',
      'Laurentia',
      'Baltica',
      'Panthalassic Ocean',
    ],
    atmosphere: {o2Percent: 8, n2Percent: 85, co2Ppm: 4_500},
    meanSurfaceTemperatureC: 17,
    notes: [
      'The Neoproterozoic Oxygenation Event raises oxygen sharply, just before animals appear.',
    ],
  },
  {
    division: 'Cryogenian',
    headline: 'Snowball Earth: ice reaches the equator, twice.',
    oceanCoverage: 0.85,
    continents: ['Rodinia (breaking apart)', 'Mirovia Ocean'],
    atmosphere: {
      o2Percent: 2,
      n2Percent: 88,
      co2Ppm: 100_000,
      note: 'Volcanic CO2 had to build to percent levels before it could melt the ice.',
    },
    meanSurfaceTemperatureC: -20,
    notes: [
      'The Sturtian and Marinoan glaciations each lasted millions of years, under ice possibly kilometers thick.',
      'Almost the entire ocean surface froze over at the glacial maxima.',
    ],
  },
  {
    division: 'Tonian',
    headline:
      'Rodinia begins to break apart, and the first multicellular algae appear.',
    continents: ['Rodinia (rifting)', 'Mirovia Ocean'],
    atmosphere: {o2Percent: 2, n2Percent: 88, co2Ppm: 15_000, ch4Ppm: 10},
    meanSurfaceTemperatureC: 18,
  },

  {
    division: 'Mesoproterozoic',
    headline:
      'The "boring billion": stable continents, stagnant chemistry, and very slow biological change.',
    oceanCoverage: 0.87,
    atmosphere: {o2Percent: 1, n2Percent: 89, co2Ppm: 10_000, ch4Ppm: 20},
    meanSurfaceTemperatureC: 19,
  },
  {
    division: 'Stenian',
    headline: 'Rodinia assembles along the Grenville mountain belt.',
    continents: ['Rodinia (assembling)', 'Grenville orogenic belt'],
  },
  {
    division: 'Ectasian',
    headline: 'Quiet, shallow, sulfidic seas — and the oldest known red algae.',
    continents: ['Columbia (Nuna), breaking up'],
  },
  {
    division: 'Calymmian',
    headline:
      'Columbia breaks up, and eukaryotes with organelles begin to diversify.',
    continents: ['Columbia (Nuna), rifting'],
  },

  {
    division: 'Paleoproterozoic',
    headline: 'Free oxygen enters the air, and the first ice age follows.',
    oceanCoverage: 0.87,
    atmosphere: {o2Percent: 1, n2Percent: 88, co2Ppm: 30_000, ch4Ppm: 50},
    meanSurfaceTemperatureC: 15,
  },
  {
    division: 'Statherian',
    headline:
      'Columbia (Nuna) assembles — the first supercontinent we can reconstruct with confidence.',
    continents: ['Columbia (Nuna), assembling'],
    atmosphere: {o2Percent: 1, co2Ppm: 20_000},
  },
  {
    division: 'Orosirian',
    headline:
      'Mountain-building on every craton, and two of the largest impacts on record: Vredefort and Sudbury.',
    continents: ['Kenorland (fragmenting)', 'proto-Columbia cratons'],
  },
  {
    division: 'Rhyacian',
    headline:
      'The Huronian glaciation — the first ice age, once oxygen destroyed the methane greenhouse.',
    continents: ['Kenorland'],
    atmosphere: {o2Percent: 0.5, co2Ppm: 40_000, ch4Ppm: 10},
    meanSurfaceTemperatureC: -5,
  },
  {
    division: 'Siderian',
    headline:
      'The Great Oxidation Event: cyanobacteria put free oxygen into the air, rusting the oceans into banded iron.',
    continents: ['Kenorland', 'Vaalbara'],
    atmosphere: {
      o2Percent: 0.2,
      n2Percent: 85,
      co2Ppm: 50_000,
      ch4Ppm: 100,
      note: 'Oxygen goes from essentially nothing to a fraction of a percent — a poison to almost everything then alive.',
    },
    meanSurfaceTemperatureC: 20,
  },

  // ========== ARCHEAN EON ==========

  {
    division: 'Archean',
    headline:
      'An anoxic, ocean-covered world of small cratons and microbial mats under a faint Sun.',
    oceanCoverage: 0.9,
    continents: ['small basaltic protocontinents'],
    atmosphere: {
      o2Percent: 0,
      n2Percent: 80,
      co2Ppm: 100_000,
      ch4Ppm: 1_000,
      note: 'No free oxygen: nitrogen, CO2, and methane, with a strong greenhouse.',
    },
    meanSurfaceTemperatureC: 30,
  },
  {
    division: 'Neoarchean',
    headline:
      'Oxygen-producing cyanobacteria are already at work, but the air stays anoxic.',
    oceanCoverage: 0.88,
    continents: ['Kenorland (assembling)', 'Vaalbara'],
    atmosphere: {o2Percent: 0.0001, co2Ppm: 80_000, ch4Ppm: 1_000},
    meanSurfaceTemperatureC: 28,
  },
  {
    division: 'Mesoarchean',
    headline:
      'The oldest fossil reefs: stromatolites built by microbial mats in shallow seas.',
    oceanCoverage: 0.9,
    continents: ['Vaalbara', 'Ur'],
    meanSurfaceTemperatureC: 30,
  },
  {
    division: 'Paleoarchean',
    headline:
      'The oldest well-preserved microfossils, under a Sun a quarter fainter than today’s.',
    oceanCoverage: 0.92,
    continents: ['scattered small cratons (Pilbara, Kaapvaal)'],
    meanSurfaceTemperatureC: 32,
    notes: [
      'The faint young Sun paradox: a much dimmer Sun, yet liquid oceans — the greenhouse must have been enormous.',
    ],
  },
  {
    division: 'Eoarchean',
    headline:
      'The oldest surviving crust, and the first chemical traces of life.',
    oceanCoverage: 0.95,
    continents: ['the first small cratons, mostly submerged'],
    atmosphere: {o2Percent: 0, n2Percent: 75, co2Ppm: 200_000, ch4Ppm: 3_000},
    meanSurfaceTemperatureC: 35,
  },

  // ========== HADEAN EON ==========

  {
    division: 'Hadean',
    headline:
      'A magma ocean, a Moon congealing out of the debris of a planetary collision, and the first water.',
    oceanCoverage: 1,
    continents: ['none — no lasting crust'],
    atmosphere: {
      o2Percent: 0,
      n2Percent: 40,
      co2Ppm: 500_000,
      ch4Ppm: 10_000,
      note: 'A steam-and-CO2 atmosphere many times denser than today’s, with no free oxygen at all.',
    },
    meanSurfaceTemperatureC: 100,
    notes: [
      'The Moon-forming impact melted the entire planet; the Moon then orbited perhaps twenty times closer than it does now.',
      'Liquid water existed by 4.4 Ga — the oldest zircons record it.',
      'Heavy impacts kept resetting the surface for hundreds of millions of years.',
    ],
  },
];

const EARTH_STATE_BY_DIVISION = new Map(
  EARTH_STATES.map(state => [state.division, state])
);

/** The recorded state for one division, without inheriting from its parents. */
export function getEarthState(division: string): EarthState | null {
  return EARTH_STATE_BY_DIVISION.get(division) ?? null;
}

/**
 * Copies every field `source` has and `target` is missing, and reports whether
 * it copied anything. Used to layer a division's own state over its parents'.
 */
function fillMissingFields<T extends object>(target: T, source: T): boolean {
  let filled = false;

  for (const key of Object.keys(source) as (keyof T)[]) {
    if (source[key] !== undefined && target[key] === undefined) {
      target[key] = source[key];
      filled = true;
    }
  }

  return filled;
}

/**
 * The state for a division, with any gaps filled in from the divisions that
 * contain it — so the Late Jurassic inherits Jurassic paleogeography, and a
 * Jurassic age inherits both.
 *
 * Returns null when neither the division nor any of its parents has an entry.
 */
export function resolveEarthState(
  division: GeologicPeriod
): ResolvedEarthState | null {
  const ancestry = [
    division.name,
    division.subEpoch,
    division.epoch,
    division.period,
    division.era,
    division.eon,
  ].filter(
    (name, index, names): name is string =>
      name !== undefined && names.indexOf(name) === index
  );

  const resolved: ResolvedEarthState = {
    division: division.name,
    resolvedFrom: [],
  };

  for (const name of ancestry) {
    const state = EARTH_STATE_BY_DIVISION.get(name);
    if (!state) continue;

    let contributed = false;

    if (state.atmosphere) {
      if (resolved.atmosphere) {
        contributed = fillMissingFields(resolved.atmosphere, state.atmosphere);
      } else {
        resolved.atmosphere = {...state.atmosphere};
        contributed = true;
      }
    }

    // Everything but the atmosphere, which was merged field by field above.
    const flatFields: EarthState = {...state};
    delete flatFields.atmosphere;
    if (fillMissingFields(resolved, flatFields)) contributed = true;

    if (contributed) resolved.resolvedFrom.push(name);
  }

  return resolved.resolvedFrom.length > 0 ? resolved : null;
}

/** The resolved state of the planet at a moment in the past. */
export function getEarthStateAtTime(
  time: TimePoint
): ResolvedEarthState | null {
  const division = getPeriodAtTime(time);
  return division ? resolveEarthState(division) : null;
}
