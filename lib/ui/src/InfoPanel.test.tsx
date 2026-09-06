import {render, screen} from '@testing-library/react';
import {describe, it, expect} from 'vitest';
import {NimbusInfoPanel} from './InfoPanel';

describe('NimbusInfoPanel', () => {
  it('shows the title, subtitle, and code when all are given', () => {
    render(
      <NimbusInfoPanel
        title="Bubble Sort"
        subtitle="Time complexity: O(n²)"
        code="for (...) {}"
      />
    );

    expect(screen.getByText('Bubble Sort')).toBeInTheDocument();
    expect(screen.getByText(/O\(n²\)/)).toBeInTheDocument();
    expect(screen.getByText('for (...) {}')).toBeInTheDocument();
  });

  it('omits the subtitle and code block when not given', () => {
    render(<NimbusInfoPanel title="Just a title" />);

    expect(screen.getByText('Just a title')).toBeInTheDocument();
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
  });
});
