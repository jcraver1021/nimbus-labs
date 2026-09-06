import {render, screen} from '@testing-library/react';
import {describe, it, expect, vi} from 'vitest';
import {NimbusErrorBoundary} from './ErrorBoundary';

function Bomb(): never {
  throw new Error('boom');
}

describe('NimbusErrorBoundary', () => {
  it('renders children when nothing throws', () => {
    render(
      <NimbusErrorBoundary>
        <div>fine</div>
      </NimbusErrorBoundary>
    );

    expect(screen.getByText('fine')).toBeInTheDocument();
  });

  it('renders a fallback when a child throws', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <NimbusErrorBoundary>
        <Bomb />
      </NimbusErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('boom')).toBeInTheDocument();
  });
});
