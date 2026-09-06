/**
 * Geometry for the dive.
 *
 * Every block is the same height regardless of how long its division lasted —
 * the Holocene is 11,700 years and the Hadean is 600 million, and a scroll
 * scaled to duration would make all but a handful of blocks invisible. Depth
 * down the page is therefore a block count, not a linear time axis.
 *
 * The surface band above the first block is exactly as tall as the depth
 * marker's offset into the viewport, which makes scroll offset and depth the
 * same measurement: at the top of the scroll the marker sits on the present,
 * and at the bottom it sits on Earth's formation. Nothing here has to measure
 * the DOM.
 */

/** Height of one block, in pixels. */
export const STRATUM_HEIGHT_PX = 300;

/**
 * Where the depth marker sits in the scroll viewport, as a fraction from the
 * top. The block under this line is the one the side panel describes.
 */
export const DEPTH_MARKER_FRACTION = 0.35;

/** Height of the surface band above the first block, in viewport units. */
export const SURFACE_HEIGHT_VH = DEPTH_MARKER_FRACTION * 100;

/** Height of the floor below the last block, in viewport units. */
export const FLOOR_HEIGHT_VH = 100 - SURFACE_HEIGHT_VH;

export interface DivePosition {
  /** Index of the block under the depth marker. */
  index: number;
  /** How far into that block the marker has reached, from 0 to 1. */
  fraction: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Where the depth marker has reached, for a given scroll offset. */
export function divePositionAt(scrollTop: number, count: number): DivePosition {
  if (count === 0) return {index: 0, fraction: 0};

  const depth = clamp(scrollTop / STRATUM_HEIGHT_PX, 0, count);

  // The very bottom belongs to the last block rather than to a block past it.
  const index = Math.min(count - 1, Math.floor(depth));
  return {index, fraction: clamp(depth - index, 0, 1)};
}

/**
 * The scroll offset that brings a given depth under the marker. Takes a
 * fractional depth so that dragging the slider can land between blocks.
 */
export function scrollTopForDepth(depth: number): number {
  return Math.max(0, depth) * STRATUM_HEIGHT_PX;
}

/**
 * A CSS gradient blending each block's colour into its neighbours', with each
 * colour landing on the centre of its own block. Painted behind the whole
 * strata column so scrolling reads as one continuous core sample.
 */
export function strataGradient(colors: string[]): string {
  if (colors.length === 0) return 'none';

  const stops = colors.map((color, index) => {
    const percent = ((index + 0.5) / colors.length) * 100;
    return `${color} ${percent.toFixed(3)}%`;
  });

  return `linear-gradient(to bottom, ${colors[0]} 0%, ${stops.join(', ')}, ${
    colors[colors.length - 1]
  } 100%)`;
}
