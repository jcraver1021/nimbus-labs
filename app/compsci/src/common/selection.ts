export type Selection =
  'selected' | 'sorted' | 'left' | 'right' | 'pivot' | undefined;

export const defaultElevation = 1;
export const selectedElevation = 6;

export function getSelectionElevation(state: Selection) {
  return state === 'selected' ||
    state === 'left' ||
    state === 'right' ||
    state === 'pivot'
    ? selectedElevation
    : defaultElevation;
}
