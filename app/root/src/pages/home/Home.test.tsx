import {render, screen} from '@testing-library/react';
import {describe, it, expect} from 'vitest';
import {getNimbusAppUrl} from '@nimbus-labs/ui';
import Home from './Home';

describe('Home', () => {
  it('links to each sub-app at its deployed URL', () => {
    render(<Home />);

    expect(screen.getByRole('link', {name: /bio/i})).toHaveAttribute(
      'href',
      getNimbusAppUrl('bio')
    );
    expect(screen.getByRole('link', {name: /compsci/i})).toHaveAttribute(
      'href',
      getNimbusAppUrl('compsci')
    );
    expect(screen.getByRole('link', {name: /geo/i})).toHaveAttribute(
      'href',
      getNimbusAppUrl('geo')
    );
  });
});
