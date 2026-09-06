import {render, screen} from '@testing-library/react';
import {describe, it, expect} from 'vitest';
import {AlgorithmInfoPanel} from './AlgorithmInfoPanel';

describe('AlgorithmInfoPanel', () => {
  it('shows the name, time complexity, and code', () => {
    render(
      <AlgorithmInfoPanel
        name="Bubble Sort"
        timeComplexity="O(n²)"
        code="for (...) {}"
      />
    );

    expect(screen.getByText('Bubble Sort')).toBeInTheDocument();
    expect(screen.getByText('Time complexity: O(n²)')).toBeInTheDocument();
    expect(screen.getByText('for (...) {}')).toBeInTheDocument();
  });
});
