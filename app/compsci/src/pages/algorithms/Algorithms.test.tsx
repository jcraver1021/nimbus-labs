import {render, screen, within} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {describe, it, expect} from 'vitest';
import Algorithms from './Algorithms';

describe('Algorithms', () => {
  it('links to the sort and search pages', () => {
    render(
      <MemoryRouter>
        <Algorithms />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', {name: /sorting/i})).toHaveAttribute(
      'href',
      '/algorithms/sort'
    );
    expect(screen.getByRole('link', {name: /searching/i})).toHaveAttribute(
      'href',
      '/algorithms/search'
    );
  });

  it('shows a breadcrumb rooted at Nimbus Labs, through CompSci', () => {
    render(
      <MemoryRouter>
        <Algorithms />
      </MemoryRouter>
    );

    const breadcrumb = screen.getByRole('navigation', {name: 'breadcrumb'});
    expect(
      within(breadcrumb).getByRole('link', {name: 'Nimbus Labs'})
    ).toBeInTheDocument();
    expect(
      within(breadcrumb).getByRole('link', {name: 'CompSci'})
    ).toHaveAttribute('href', '/');
    expect(within(breadcrumb).getByText('Algorithms')).toBeInTheDocument();
  });
});
