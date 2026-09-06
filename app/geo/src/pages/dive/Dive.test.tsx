import {render, screen, fireEvent, within} from '@testing-library/react';
import {describe, it, expect, beforeAll, vi} from 'vitest';
import {MemoryRouter} from 'react-router-dom';
import {STRATUM_HEIGHT_PX} from '../../utils/diveLayout';
import Dive from './Dive';

/** The scroll container, which owns the dive's depth. */
function scrollContainer(): HTMLElement {
  const container = document.querySelector('.dive-scroll');
  if (!container) throw new Error('the dive has no scroll container');
  return container as HTMLElement;
}

/** Scrolls the dive to a block as a browser would, and lets it react. */
function scrollToBlock(index: number) {
  const container = scrollContainer();
  container.scrollTop = index * STRATUM_HEIGHT_PX;
  fireEvent.scroll(container);
}

const column = () =>
  screen.getByRole('list', {name: 'Geologic divisions, present to oldest'});

const panel = () =>
  screen.getByRole('complementary', {name: 'The world at this depth'});

beforeAll(() => {
  // jsdom has no layout engine and so no scrollTo; the tests move the
  // container directly instead, which is all the component uses it for.
  Element.prototype.scrollTo = vi.fn();
});

describe('Dive', () => {
  const renderDive = () =>
    render(
      <MemoryRouter>
        <Dive />
      </MemoryRouter>
    );

  it('starts at the surface, in the present', () => {
    renderDive();

    expect(screen.getByText('Today · the surface')).toBeInTheDocument();
    expect(
      within(panel()).getByText(/The world at 0 years ago/)
    ).toBeInTheDocument();
    expect(
      within(panel()).getByRole('heading', {name: 'Holocene'})
    ).toBeInTheDocument();
  });

  it('lays out one block per division, ending at Earth’s formation', () => {
    renderDive();

    expect(within(column()).getAllByRole('listitem')).toHaveLength(48);
    expect(within(column()).getByText('Hadean')).toBeInTheDocument();
    expect(
      screen.getByText(/Earth forms · 4.60B years ago/)
    ).toBeInTheDocument();
  });

  it('shows each block’s place in the hierarchy and its defining feature', () => {
    renderDive();

    const block = within(column())
      .getByRole('heading', {name: 'Late Jurassic'})
      .closest('li');
    const jurassic = within(block as HTMLElement);

    expect(
      jurassic.getByText('Phanerozoic › Mesozoic › Jurassic')
    ).toBeInTheDocument();
    expect(jurassic.getByText('epoch')).toBeInTheDocument();
    expect(
      jurassic.getByText(
        /145.0M years ago – 163.5M years ago · 18.5M years long/
      )
    ).toBeInTheDocument();
    expect(
      jurassic.getByText(/sauropods reach their largest/)
    ).toBeInTheDocument();
  });

  it('follows the scroll into the block under the depth marker', () => {
    renderDive();

    scrollToBlock(20); // The Late Devonian, a little under halfway down.

    expect(
      within(panel()).getByRole('heading', {name: 'Late Devonian'})
    ).toBeInTheDocument();
    expect(
      within(panel()).getByText(/The world at 358.9M years ago/)
    ).toBeInTheDocument();
  });

  it('reports the state of the planet for the active block', () => {
    renderDive();

    scrollToBlock(7); // The Late Cretaceous.

    const facts = within(panel());
    expect(facts.getByText('250 m above today')).toBeInTheDocument();
    expect(facts.getByText('85% of the surface')).toBeInTheDocument();
    expect(facts.getByText('26.0% O₂')).toBeInTheDocument();
    expect(facts.getByText('Laurasia')).toBeInTheDocument();
  });

  it('shortens the day and enlarges the Moon as the dive goes deeper', () => {
    renderDive();

    expect(within(panel()).getByText('24.0 hours')).toBeInTheDocument();
    expect(
      within(panel()).getByText(/about the same width as today/)
    ).toBeInTheDocument();

    scrollToBlock(47); // The Hadean.

    const dayLength = Number(
      within(panel())
        .getByText(/ hours$/)
        .textContent?.replace(' hours', '')
    );
    expect(dayLength).toBeLessThan(12);
    expect(within(panel()).getByText(/× as wide as today/)).toBeInTheDocument();
  });

  it('offers a jump to each eon, plus both ends of the record', () => {
    renderDive();

    const jumps = screen.getByRole('group', {
      name: 'Jump through geologic time',
    });

    expect(
      within(jumps)
        .getAllByRole('button')
        .map(button => button.textContent)
    ).toEqual([
      'Present',
      'Phanerozoic',
      'Proterozoic',
      'Archean',
      'Hadean',
      'Earth forms',
    ]);
  });

  it('scrolls the column when a jump is taken', () => {
    renderDive();

    fireEvent.click(screen.getByRole('button', {name: 'Archean'}));

    expect(scrollContainer().scrollTo).toHaveBeenCalledWith({
      // Block 43 is the first of the Archean.
      top: 43 * STRATUM_HEIGHT_PX,
      behavior: 'smooth',
    });
  });
});
