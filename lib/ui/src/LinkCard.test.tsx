import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {describe, it, expect} from 'vitest';
import {NimbusLinkCard} from './LinkCard';

describe('NimbusLinkCard', () => {
  it('links to an in-app route via `to`', () => {
    render(
      <MemoryRouter>
        <NimbusLinkCard
          title="Timeline"
          description="Scroll through time"
          to="/timeline"
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', {name: /Timeline/})).toHaveAttribute(
      'href',
      '/timeline'
    );
  });

  it('links to an external URL via `href`', () => {
    render(
      <NimbusLinkCard
        title="Bio"
        description="Biology visualizations"
        href="https://nimbus-laboratories-bio.web.app"
      />
    );

    expect(screen.getByRole('link', {name: /Bio/})).toHaveAttribute(
      'href',
      'https://nimbus-laboratories-bio.web.app'
    );
  });
});
