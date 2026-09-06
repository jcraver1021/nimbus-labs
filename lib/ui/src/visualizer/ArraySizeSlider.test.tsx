import {render, screen} from '@testing-library/react';
import {describe, it, expect, vi} from 'vitest';
import {NimbusArraySizeSlider} from './ArraySizeSlider';

describe('NimbusArraySizeSlider', () => {
  it('renders a labeled slider bounded to [1, 16]', () => {
    render(<NimbusArraySizeSlider defaultValue={5} onChange={vi.fn()} />);

    const slider = screen.getByRole('slider', {name: 'Array size'});
    expect(slider).toHaveAttribute('aria-valuemin', '1');
    expect(slider).toHaveAttribute('aria-valuemax', '16');
    expect(slider).toHaveAttribute('aria-valuenow', '5');
  });
});
