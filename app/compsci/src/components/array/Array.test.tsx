import {render, screen} from '@testing-library/react';
import Array from './Array';
import {describe, it, expect} from 'vitest';

describe('Array', () => {
  it('renders correct number of Datum components', () => {
    const values = [10, 20, 30, 40, 50];
    render(<Array values={values} />);
    const datumElements = screen.getAllByText(/^\d+$/);
    expect(datumElements.length).toBe(values.length);
  });
});
