export type Selection = 'selected' | undefined;

export const defaultElevation = 1;
export const selectedElevation = 6;

export function getSelectionElevation(state: Selection) {
  return state === 'selected' ? selectedElevation : defaultElevation;
}
