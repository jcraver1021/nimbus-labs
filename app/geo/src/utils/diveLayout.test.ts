import {describe, it, expect} from 'vitest';
import {
  DEPTH_MARKER_FRACTION,
  FLOOR_HEIGHT_VH,
  STRATUM_HEIGHT_PX,
  SURFACE_HEIGHT_VH,
  divePositionAt,
  scrollTopForDepth,
  strataGradient,
} from './diveLayout';

const COUNT = 48;

describe('the surface and floor bands', () => {
  it('together make exactly one viewport, so depth tracks scroll offset', () => {
    expect(SURFACE_HEIGHT_VH + FLOOR_HEIGHT_VH).toBe(100);
    expect(SURFACE_HEIGHT_VH).toBe(DEPTH_MARKER_FRACTION * 100);
  });
});

describe('divePositionAt', () => {
  it('sits on the present at the top of the scroll', () => {
    expect(divePositionAt(0, COUNT)).toEqual({index: 0, fraction: 0});
  });

  it('reports the block sitting under the depth marker', () => {
    expect(divePositionAt(5 * STRATUM_HEIGHT_PX, COUNT).index).toBe(5);
  });

  it('reports how far into that block the marker has reached', () => {
    const position = divePositionAt(5.25 * STRATUM_HEIGHT_PX, COUNT);

    expect(position.index).toBe(5);
    expect(position.fraction).toBeCloseTo(0.25, 6);
  });

  it('ends on the far edge of the last block, not past it', () => {
    const position = divePositionAt(COUNT * STRATUM_HEIGHT_PX, COUNT);

    expect(position.index).toBe(COUNT - 1);
    expect(position.fraction).toBe(1);
  });

  it('never runs off either end', () => {
    expect(divePositionAt(-5_000, COUNT)).toEqual({index: 0, fraction: 0});
    expect(divePositionAt(10_000_000, COUNT).index).toBe(COUNT - 1);
  });

  it('copes with an empty column', () => {
    expect(divePositionAt(0, 0)).toEqual({index: 0, fraction: 0});
  });
});

describe('scrollTopForDepth', () => {
  it('round-trips with divePositionAt', () => {
    for (const depth of [0, 1, 7, 23, 47]) {
      expect(divePositionAt(scrollTopForDepth(depth), COUNT).index).toBe(depth);
    }
  });

  it('lands between blocks for a fractional depth', () => {
    const position = divePositionAt(scrollTopForDepth(12.5), COUNT);

    expect(position.index).toBe(12);
    expect(position.fraction).toBeCloseTo(0.5, 6);
  });

  it('does not ask for a negative scroll offset', () => {
    expect(scrollTopForDepth(0)).toBe(0);
    expect(scrollTopForDepth(-3)).toBe(0);
  });
});

describe('strataGradient', () => {
  it('centres each colour on its own block', () => {
    expect(strataGradient(['#aaaaaa', '#bbbbbb'])).toBe(
      'linear-gradient(to bottom, #aaaaaa 0%, #aaaaaa 25.000%, #bbbbbb 75.000%, #bbbbbb 100%)'
    );
  });

  it('has nothing to paint for an empty column', () => {
    expect(strataGradient([])).toBe('none');
  });
});
