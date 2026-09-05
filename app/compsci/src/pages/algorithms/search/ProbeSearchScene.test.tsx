import {render, act} from '@testing-library/react';
import {vi, describe, it, expect, afterEach} from 'vitest';
import ProbeSearchScene from './ProbeSearchScene';
import {type ProbeSearchAlgorithm} from '../searchAlgorithm';
import {type DatumEntry} from '../../../common/datum';

// ── Helpers ────────────────────────────────────────────────────────────────

const entries: DatumEntry[] = [
  {id: 100, value: 1},
  {id: 101, value: 2},
  {id: 102, value: 3},
];

function makeAlgorithm(
  searchFn: ProbeSearchAlgorithm['search']
): ProbeSearchAlgorithm {
  return {
    scene: 'probe',
    name: 'Test',
    metadata: {timeComplexity: 'O(1)'},
    code: '',
    search: searchFn,
  };
}

const baseProps = {
  entries,
  target: 2,
  speed: 1,
  abortRef: {current: false} as React.RefObject<boolean>,
  onSearchEnd: () => {},
};

// ── Tests ──────────────────────────────────────────────────────────────────

describe('ProbeSearchScene', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does not call search when searchKey is 0', async () => {
    const searchFn = vi
      .fn<ProbeSearchAlgorithm['search']>()
      .mockResolvedValue(undefined);
    render(
      <ProbeSearchScene
        {...baseProps}
        algorithm={makeAlgorithm(searchFn)}
        searchKey={0}
      />
    );
    await act(async () => {});
    expect(searchFn).not.toHaveBeenCalled();
  });

  it('calls search once when searchKey is 1', async () => {
    const searchFn = vi
      .fn<ProbeSearchAlgorithm['search']>()
      .mockResolvedValue(undefined);
    render(
      <ProbeSearchScene
        {...baseProps}
        algorithm={makeAlgorithm(searchFn)}
        searchKey={1}
      />
    );
    await act(async () => {});
    expect(searchFn).toHaveBeenCalledTimes(1);
  });

  it('calls search again when searchKey increments', async () => {
    const searchFn = vi
      .fn<ProbeSearchAlgorithm['search']>()
      .mockResolvedValue(undefined);
    const algorithm = makeAlgorithm(searchFn);
    const {rerender} = render(
      <ProbeSearchScene {...baseProps} algorithm={algorithm} searchKey={1} />
    );
    await act(async () => {});
    expect(searchFn).toHaveBeenCalledTimes(1);

    rerender(
      <ProbeSearchScene {...baseProps} algorithm={algorithm} searchKey={2} />
    );
    await act(async () => {});
    expect(searchFn).toHaveBeenCalledTimes(2);
  });

  it('calls onSearchEnd after search completes', async () => {
    const onSearchEnd = vi.fn();
    render(
      <ProbeSearchScene
        {...baseProps}
        algorithm={makeAlgorithm(
          vi.fn<ProbeSearchAlgorithm['search']>().mockResolvedValue(undefined)
        )}
        searchKey={1}
        onSearchEnd={onSearchEnd}
      />
    );
    await act(async () => {});
    expect(onSearchEnd).toHaveBeenCalledTimes(1);
  });

  it('does not call onSearchEnd when aborted', async () => {
    const onSearchEnd = vi.fn();
    render(
      <ProbeSearchScene
        {...baseProps}
        algorithm={makeAlgorithm(
          vi.fn<ProbeSearchAlgorithm['search']>().mockResolvedValue(undefined)
        )}
        searchKey={1}
        abortRef={{current: true} as React.RefObject<boolean>}
        onSearchEnd={onSearchEnd}
      />
    );
    await act(async () => {});
    expect(onSearchEnd).not.toHaveBeenCalled();
  });

  it('does not search on remount when searchKey is reset to 0 (algorithm switch regression)', async () => {
    const searchFn = vi
      .fn<ProbeSearchAlgorithm['search']>()
      .mockResolvedValue(undefined);

    const {unmount} = render(
      <ProbeSearchScene
        {...baseProps}
        algorithm={makeAlgorithm(searchFn)}
        searchKey={1}
      />
    );
    await act(async () => {});
    expect(searchFn).toHaveBeenCalledTimes(1);
    unmount();

    searchFn.mockClear();
    render(
      <ProbeSearchScene
        {...baseProps}
        algorithm={makeAlgorithm(searchFn)}
        searchKey={0}
      />
    );
    await act(async () => {});
    expect(searchFn).not.toHaveBeenCalled();
  });
});
