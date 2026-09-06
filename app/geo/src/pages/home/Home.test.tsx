import {render, screen} from '@testing-library/react';
import {describe, it, expect} from 'vitest';
import {MemoryRouter} from 'react-router-dom';
import Home from './Home';

describe('Home', () => {
  it('links to the dive', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('link', {name: /a dive through deep time/i})
    ).toHaveAttribute('href', '/dive');
  });
});
