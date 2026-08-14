export type Selection = 'selected' | 'sorted' | 'left' | 'right' | undefined;

export const defaultElevation = 1;
export const selectedElevation = 6;

export function getSelectionElevation(state: Selection) {
  return state === 'selected' || state === 'left' || state === 'right'
    ? selectedElevation
    : defaultElevation;
}
