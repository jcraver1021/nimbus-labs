import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {describe, it, expect} from 'vitest';
import {NimbusBreadcrumbs} from './Breadcrumbs';
import {getNimbusAppUrl} from './links';

describe('NimbusBreadcrumbs', () => {
  it('always roots the trail at Nimbus Labs, linking to the portal', () => {
    render(
      <MemoryRouter>
        <NimbusBreadcrumbs items={[{label: 'CompSci'}]} />
      </MemoryRouter>
    );

    const root = screen.getByRole('link', {name: 'Nimbus Labs'});
    expect(root).toHaveAttribute('href', getNimbusAppUrl('root'));
  });

  it('renders the last item as plain text, not a link', () => {
    render(
      <MemoryRouter>
        <NimbusBreadcrumbs
          items={[{label: 'CompSci', href: '/'}, {label: 'Algorithms'}]}
        />
      </MemoryRouter>
    );

    expect(
      screen.queryByRole('link', {name: 'Algorithms'})
    ).not.toBeInTheDocument();
    expect(screen.getByText('Algorithms')).toBeInTheDocument();
  });

  it('renders in-app items as router links using their path', () => {
    render(
      <MemoryRouter>
        <NimbusBreadcrumbs
          items={[{label: 'CompSci', href: '/'}, {label: 'Sorting'}]}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', {name: 'CompSci'})).toHaveAttribute(
      'href',
      '/'
    );
  });
});
