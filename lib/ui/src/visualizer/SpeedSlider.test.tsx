import {render, screen} from '@testing-library/react';
import {describe, it, expect, vi} from 'vitest';
import {NimbusSpeedSlider} from './SpeedSlider';

describe('NimbusSpeedSlider', () => {
  it('renders a labeled slider at the given value', () => {
    render(<NimbusSpeedSlider value={2} onChange={vi.fn()} />);

    expect(screen.getByRole('slider', {name: 'Speed'})).toHaveAttribute(
      'aria-valuenow',
      '2'
    );
  });
});
