import {render, screen, fireEvent, act} from '@testing-library/react';
import {vi, describe, it, expect, beforeEach} from 'vitest';
import {type FlatAlgorithm} from '../../common/sortAlgorithm';
import ArraySort from './ArraySort';

// ── Mock algorithms ────────────────────────────────────────────────────────
// vi.hoisted ensures these are initialised before the hoisted vi.mock factory runs.

const {sort1, sort2} = vi.hoisted(() => ({
  sort1: vi.fn<FlatAlgorithm['sort']>().mockResolvedValue(undefined),
  sort2: vi.fn<FlatAlgorithm['sort']>().mockResolvedValue(undefined),
}));

vi.mock('./algorithms', () => ({
  algorithms: [
    {
      scene: 'flat',
      name: 'Algo One',
      metadata: {timeComplexity: 'O(1)'},
      code: 'code one',
      sort: sort1,
    } satisfies FlatAlgorithm,
    {
      scene: 'flat',
      name: 'Algo Two',
      metadata: {timeComplexity: 'O(1)'},
      code: 'code two',
      sort: sort2,
    } satisfies FlatAlgorithm,
  ],
}));

// ── Tests ──────────────────────────────────────────────────────────────────

describe('ArraySort', () => {
  beforeEach(() => {
    sort1.mockClear();
    sort2.mockClear();
  });

  it('does not start sort on initial render', async () => {
    render(<ArraySort />);
    await act(async () => {});
    expect(sort1).not.toHaveBeenCalled();
  });

  it('starts sort when Sort button clicked', async () => {
    render(<ArraySort />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: /sort/i}));
    });
    expect(sort1).toHaveBeenCalledTimes(1);
  });

  it('shows Sort button (not Stop) after instant sort completes', async () => {
    render(<ArraySort />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: /sort/i}));
    });
    // inTransition should be false once the mock resolves
    expect(screen.getByRole('button', {name: /^sort$/i})).toBeInTheDocument();
    expect(
      screen.queryByRole('button', {name: /stop/i})
    ).not.toBeInTheDocument();
  });

  // ── Regression: algorithm switch after completed sort must not auto-start ──

  it('switching algorithm after sort completes does not restart sort', async () => {
    render(<ArraySort />);

    // Complete a sort
    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: /sort/i}));
    });
    expect(sort1).toHaveBeenCalledTimes(1);

    // Open the Algorithm dropdown and select "Algo Two"
    await act(async () => {
      fireEvent.mouseDown(screen.getByRole('combobox'));
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Algo Two'));
    });
    await act(async () => {});

    expect(sort2).not.toHaveBeenCalled();
    // Sort button should be visible — sort did NOT restart
    expect(screen.getByRole('button', {name: /^sort$/i})).toBeInTheDocument();
    expect(
      screen.queryByRole('button', {name: /stop/i})
    ).not.toBeInTheDocument();
  });

  // ── Regression: Generate after Stop must not auto-start ───────────────────

  it('clicking Generate after Stop does not restart sort', async () => {
    render(<ArraySort />);

    // Start sort
    fireEvent.click(screen.getByRole('button', {name: /sort/i}));

    // Stop immediately
    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: /stop/i}));
    });
    sort1.mockClear();

    // Generate a new array
    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: /generate/i}));
    });
    await act(async () => {});

    expect(sort1).not.toHaveBeenCalled();
    expect(screen.getByRole('button', {name: /^sort$/i})).toBeInTheDocument();
  });

  // ── Regression: Generate after completed sort must not auto-start ─────────

  it('clicking Generate after sort completes does not restart sort', async () => {
    render(<ArraySort />);

    // Complete a sort
    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: /sort/i}));
    });
    expect(sort1).toHaveBeenCalledTimes(1);
    sort1.mockClear();

    // Generate
    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: /generate/i}));
    });
    await act(async () => {});

    expect(sort1).not.toHaveBeenCalled();
    expect(screen.getByRole('button', {name: /^sort$/i})).toBeInTheDocument();
  });
});
