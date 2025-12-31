import {
  getSelectionElevation,
  defaultElevation,
  selectionElevations,
} from './selection';
import {describe, it, expect} from 'vitest';

describe('GetSelectionElevation', () => {
  it('returns correct elevation for selected state', () => {
    const elevation = getSelectionElevation('selected');
    expect(elevation).toBe(selectionElevations['selected']);
  });

  it('returns correct elevation for accepted state', () => {
    const elevation = getSelectionElevation('accepted');
    expect(elevation).toBe(selectionElevations['accepted']);
  });

  it('returns correct elevation for rejected state', () => {
    const elevation = getSelectionElevation('rejected');
    expect(elevation).toBe(selectionElevations['rejected']);
  });

  it('returns correct elevation for default state', () => {
    const elevation = getSelectionElevation('');
    expect(elevation).toBe(selectionElevations['']);
  });

  it('returns correct elevation for undefined state', () => {
    const elevation = getSelectionElevation(undefined);
    expect(elevation).toBe(defaultElevation);
  });
});
