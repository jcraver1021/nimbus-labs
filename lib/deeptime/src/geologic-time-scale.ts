import type { GeologicPeriod, TimePoint } from './temporal-graph';
import { getTimeValue } from './temporal-graph';

/**
 * Geologic time scale with major periods, epochs, and eras.
 * All times are in years ago.
 * Source: International Commission on Stratigraphy (2023)
 */

export const GEOLOGIC_PERIODS: GeologicPeriod[] = [
  // Cenozoic Era - Age of Mammals
  {
    name: 'Holocene',
    start: 0,
    end: 11_700,
    epoch: 'Quaternary',
    era: 'Cenozoic',
    color: '#FEF2E0',
  },
  {
    name: 'Pleistocene',
    start: 11_700,
    end: 2_580_000,
    epoch: 'Quaternary',
    era: 'Cenozoic',
    color: '#FFF2AE',
  },
  {
    name: 'Pliocene',
    start: 2_580_000,
    end: 5_333_000,
    epoch: 'Neogene',
    era: 'Cenozoic',
    color: '#FFFACD',
  },
  {
    name: 'Miocene',
    start: 5_333_000,
    end: 23_030_000,
    epoch: 'Neogene',
    era: 'Cenozoic',
    color: '#FFFF99',
  },
  {
    name: 'Oligocene',
    start: 23_030_000,
    end: 33_900_000,
    epoch: 'Paleogene',
    era: 'Cenozoic',
    color: '#FED99A',
  },
  {
    name: 'Eocene',
    start: 33_900_000,
    end: 56_000_000,
    epoch: 'Paleogene',
    era: 'Cenozoic',
    color: '#FDC07A',
  },
  {
    name: 'Paleocene',
    start: 56_000_000,
    end: 66_000_000,
    epoch: 'Paleogene',
    era: 'Cenozoic',
    color: '#FDA75F',
  },

  // Mesozoic Era - Age of Reptiles
  {
    name: 'Late Cretaceous',
    start: 66_000_000,
    end: 100_500_000,
    epoch: 'Cretaceous',
    era: 'Mesozoic',
    color: '#8CFF74',
  },
  {
    name: 'Early Cretaceous',
    start: 100_500_000,
    end: 145_000_000,
    epoch: 'Cretaceous',
    era: 'Mesozoic',
    color: '#7EE56C',
  },
  {
    name: 'Late Jurassic',
    start: 145_000_000,
    end: 163_500_000,
    epoch: 'Jurassic',
    era: 'Mesozoic',
    color: '#67CCBA',
  },
  {
    name: 'Middle Jurassic',
    start: 163_500_000,
    end: 174_100_000,
    epoch: 'Jurassic',
    era: 'Mesozoic',
    color: '#4DB8AD',
  },
  {
    name: 'Early Jurassic',
    start: 174_100_000,
    end: 201_300_000,
    epoch: 'Jurassic',
    era: 'Mesozoic',
    color: '#33A3A0',
  },
  {
    name: 'Late Triassic',
    start: 201_300_000,
    end: 237_000_000,
    epoch: 'Triassic',
    era: 'Mesozoic',
    color: '#B28CFF',
  },
  {
    name: 'Middle Triassic',
    start: 237_000_000,
    end: 247_200_000,
    epoch: 'Triassic',
    era: 'Mesozoic',
    color: '#9E70E5',
  },
  {
    name: 'Early Triassic',
    start: 247_200_000,
    end: 251_900_000,
    epoch: 'Triassic',
    era: 'Mesozoic',
    color: '#8A54CC',
  },

  // Paleozoic Era - Ancient Life
  {
    name: 'Permian',
    start: 251_900_000,
    end: 298_900_000,
    epoch: 'Permian',
    era: 'Paleozoic',
    color: '#F04028',
  },
  {
    name: 'Carboniferous',
    start: 298_900_000,
    end: 358_900_000,
    epoch: 'Carboniferous',
    era: 'Paleozoic',
    color: '#67A599',
  },
  {
    name: 'Devonian',
    start: 358_900_000,
    end: 419_200_000,
    epoch: 'Devonian',
    era: 'Paleozoic',
    color: '#CB8C37',
  },
  {
    name: 'Silurian',
    start: 419_200_000,
    end: 443_800_000,
    epoch: 'Silurian',
    era: 'Paleozoic',
    color: '#B3E1B6',
  },
  {
    name: 'Ordovician',
    start: 443_800_000,
    end: 485_400_000,
    epoch: 'Ordovician',
    era: 'Paleozoic',
    color: '#009270',
  },
  {
    name: 'Cambrian',
    start: 485_400_000,
    end: 541_000_000,
    epoch: 'Cambrian',
    era: 'Paleozoic',
    color: '#7FA056',
  },

  // Precambrian - Early Earth
  {
    name: 'Ediacaran',
    start: 541_000_000,
    end: 635_000_000,
    epoch: 'Neoproterozoic',
    era: 'Precambrian',
    color: '#FED96A',
  },
  {
    name: 'Cryogenian',
    start: 635_000_000,
    end: 720_000_000,
    epoch: 'Neoproterozoic',
    era: 'Precambrian',
    color: '#F9CA79',
  },
];

export function getPeriodAtTime(time: TimePoint): GeologicPeriod | null {
  const timeValue = getTimeValue(time);
  return (
    GEOLOGIC_PERIODS.find(
      (period) => timeValue >= period.start && timeValue < period.end
    ) ?? null
  );
}

export function getPeriodsInRange(
  startTime: TimePoint,
  endTime: TimePoint
): GeologicPeriod[] {
  const startValue = getTimeValue(startTime);
  const endValue = getTimeValue(endTime);
  return GEOLOGIC_PERIODS.filter(
    (period) => period.start < endValue && period.end > startValue
  );
}

export function formatTimeYearsAgo(years: number): string {
  if (years < 1_000) {
    return `${years.toLocaleString()} years ago`;
  } else if (years < 1_000_000) {
    return `${(years / 1_000).toFixed(1)}k years ago`;
  } else if (years < 1_000_000_000) {
    return `${(years / 1_000_000).toFixed(1)}M years ago`;
  } else {
    return `${(years / 1_000_000_000).toFixed(1)}B years ago`;
  }
}
