import {render, act} from '@testing-library/react';
import {vi, describe, it, expect, afterEach} from 'vitest';
import FlatSortScene from './FlatSortScene';
import {type FlatAlgorithm} from '../../common/sortAlgorithm';
import {type DatumEntry} from '../../common/datum';

// ── Helpers ────────────────────────────────────────────────────────────────

const entries: DatumEntry[] = [
  {id: 100, value: 3},
  {id: 101, value: 1},
  {id: 102, value: 2},
];

function makeAlgorithm(sortFn: FlatAlgorithm['sort']): FlatAlgorithm {
  return {
    scene: 'flat',
    name: 'Test',
    metadata: {timeComplexity: 'O(1)'},
    code: '',
    sort: sortFn,
  };
}

const baseProps = {
  entries,
  onEntriesChange: () => {},
  speed: 1,
  abortRef: {current: false} as React.RefObject<boolean>,
  onSortEnd: () => {},
};

// ── Tests ──────────────────────────────────────────────────────────────────

describe('FlatSortScene', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does not call sort when sortKey is 0', async () => {
    const sortFn = vi.fn<FlatAlgorithm['sort']>().mockResolvedValue(undefined);
    render(
      <FlatSortScene
        {...baseProps}
        algorithm={makeAlgorithm(sortFn)}
        sortKey={0}
      />
    );
    await act(async () => {});
    expect(sortFn).not.toHaveBeenCalled();
  });

  it('calls sort once when sortKey is 1', async () => {
    const sortFn = vi.fn<FlatAlgorithm['sort']>().mockResolvedValue(undefined);
    render(
      <FlatSortScene
        {...baseProps}
        algorithm={makeAlgorithm(sortFn)}
        sortKey={1}
      />
    );
    await act(async () => {});
    expect(sortFn).toHaveBeenCalledTimes(1);
  });

  it('calls sort again when sortKey increments', async () => {
    const sortFn = vi.fn<FlatAlgorithm['sort']>().mockResolvedValue(undefined);
    const algorithm = makeAlgorithm(sortFn);
    const {rerender} = render(
      <FlatSortScene {...baseProps} algorithm={algorithm} sortKey={1} />
    );
    await act(async () => {});
    expect(sortFn).toHaveBeenCalledTimes(1);

    rerender(
      <FlatSortScene {...baseProps} algorithm={algorithm} sortKey={2} />
    );
    await act(async () => {});
    expect(sortFn).toHaveBeenCalledTimes(2);
  });

  it('calls onSortEnd after sort completes', async () => {
    const onSortEnd = vi.fn();
    render(
      <FlatSortScene
        {...baseProps}
        algorithm={makeAlgorithm(
          vi.fn<FlatAlgorithm['sort']>().mockResolvedValue(undefined)
        )}
        sortKey={1}
        onSortEnd={onSortEnd}
      />
    );
    await act(async () => {});
    expect(onSortEnd).toHaveBeenCalledTimes(1);
  });

  it('does not call onSortEnd when aborted', async () => {
    const onSortEnd = vi.fn();
    // Mark abort before mount so the sort sees it immediately on completion
    render(
      <FlatSortScene
        {...baseProps}
        algorithm={makeAlgorithm(
          vi.fn<FlatAlgorithm['sort']>().mockResolvedValue(undefined)
        )}
        sortKey={1}
        abortRef={{current: true} as React.RefObject<boolean>}
        onSortEnd={onSortEnd}
      />
    );
    await act(async () => {});
    expect(onSortEnd).not.toHaveBeenCalled();
  });

  // Regression: after fix, ArraySort resets sortKey to 0 on algorithm change.
  // A freshly mounted scene with sortKey=0 must not start sorting.
  it('does not sort on remount when sortKey is reset to 0 (algorithm switch regression)', async () => {
    const sortFn = vi.fn<FlatAlgorithm['sort']>().mockResolvedValue(undefined);

    // Simulate: a previous scene ran sortKey=1
    const {unmount} = render(
      <FlatSortScene
        {...baseProps}
        algorithm={makeAlgorithm(sortFn)}
        sortKey={1}
      />
    );
    await act(async () => {});
    expect(sortFn).toHaveBeenCalledTimes(1);
    unmount();

    // Simulate: ArraySort resets sortKey to 0 then mounts a new scene
    sortFn.mockClear();
    render(
      <FlatSortScene
        {...baseProps}
        algorithm={makeAlgorithm(sortFn)}
        sortKey={0}
      />
    );
    await act(async () => {});
    expect(sortFn).not.toHaveBeenCalled();
  });
});
