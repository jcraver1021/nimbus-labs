import {type DatumEntry} from './datum';

/** Maps each entry's stable id to its current array index. */
export function slotsFromEntries(entries: DatumEntry[]): Map<number, number> {
  return new Map(entries.map((e, i) => [e.id, i]));
}
