import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import MobileOrderContainer from './MobileOrder.container';

describe('MobileOrderContainer', () => {
  it('should render successfully', () => {
    const { container } = render(
      <MemoryRouter>
        <MobileOrderContainer />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
  });
});
