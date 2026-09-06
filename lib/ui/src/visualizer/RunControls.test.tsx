import {render, screen} from '@testing-library/react';
import {describe, it, expect, vi} from 'vitest';
import {NimbusRunControls} from './RunControls';

describe('NimbusRunControls', () => {
  it('shows the run button when idle', () => {
    render(
      <NimbusRunControls
        inTransition={false}
        onGenerate={vi.fn()}
        onRun={vi.fn()}
        onStop={vi.fn()}
        runLabel="Sort"
      />
    );

    expect(screen.getByRole('button', {name: 'Generate'})).toBeEnabled();
    expect(screen.getByRole('button', {name: 'Sort'})).toBeInTheDocument();
    expect(
      screen.queryByRole('button', {name: 'Stop'})
    ).not.toBeInTheDocument();
  });

  it('swaps to Stop and disables Generate while running', () => {
    render(
      <NimbusRunControls
        inTransition={true}
        onGenerate={vi.fn()}
        onRun={vi.fn()}
        onStop={vi.fn()}
        runLabel="Sort"
      />
    );

    expect(screen.getByRole('button', {name: 'Generate'})).toBeDisabled();
    expect(screen.getByRole('button', {name: 'Stop'})).toBeInTheDocument();
    expect(
      screen.queryByRole('button', {name: 'Sort'})
    ).not.toBeInTheDocument();
  });
});
