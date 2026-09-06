import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {describe, it, expect} from 'vitest';
import {NimbusPageHeader} from './PageHeader';

describe('NimbusPageHeader', () => {
  it('renders the title and description without breadcrumbs', () => {
    render(
      <NimbusPageHeader title="Nimbus Labs">
        <p>Welcome</p>
      </NimbusPageHeader>
    );

    expect(
      screen.getByRole('heading', {name: 'Nimbus Labs'})
    ).toBeInTheDocument();
    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('renders the breadcrumb trail when given one', () => {
    render(
      <MemoryRouter>
        <NimbusPageHeader breadcrumbs={[{label: 'CompSci'}]} title="CompSci" />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('navigation', {name: 'breadcrumb'})
    ).toBeInTheDocument();
  });
});
