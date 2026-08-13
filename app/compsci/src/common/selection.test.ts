import {
  getSelectionElevation,
  defaultElevation,
  selectedElevation,
} from './selection';
import {describe, it, expect} from 'vitest';

describe('GetSelectionElevation', () => {
  it('returns correct elevation for selected state', () => {
    const elevation = getSelectionElevation('selected');
    expect(elevation).toBe(selectedElevation);
  });

  it('returns correct elevation for undefined state', () => {
    const elevation = getSelectionElevation(undefined);
    expect(elevation).toBe(defaultElevation);
  });
});
