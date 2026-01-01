import {render, screen} from '@testing-library/react';
import Datum from './Datum';
import {describe, it, expect} from 'vitest';

describe('Datum', () => {
  it('renders with correct value', () => {
    render(<Datum value={42} />);
    const datumElement = screen.getByText('42');
    expect(datumElement).toBeInTheDocument();
  });
});
