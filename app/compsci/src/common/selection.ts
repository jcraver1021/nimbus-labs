export type Selection = 'selected' | 'sorted' | undefined;

export const defaultElevation = 1;
export const selectedElevation = 6;

export function getSelectionElevation(state: Selection) {
  return state === 'selected' ? selectedElevation : defaultElevation;
}
