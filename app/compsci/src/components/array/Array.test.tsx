import {render, screen} from '@testing-library/react';
import Array from './Array';
import {describe, it, expect} from 'vitest';

describe('Array', () => {
  it('renders correct number of Datum components', () => {
    const entries = [
      {id: 0, value: 10},
      {id: 1, value: 20},
      {id: 2, value: 30},
      {id: 3, value: 40},
      {id: 4, value: 50},
    ];
    render(<Array entries={entries} />);
    const datumElements = screen.getAllByText(/^\d+$/);
    expect(datumElements.length).toBe(entries.length);
  });
});
