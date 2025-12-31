export type Selection = 'selected' | 'accepted' | 'rejected' | '' | undefined;

export const defaultElevation = 1;
export const selectionElevations: Record<
  Exclude<Selection, undefined>,
  number
> = {
  selected: 6,
  accepted: 12,
  rejected: 3,
  '': defaultElevation,
};

export function getSelectionElevation(state: Selection) {
  if (state === undefined) {
    return defaultElevation;
  }
  return selectionElevations[state];
}
