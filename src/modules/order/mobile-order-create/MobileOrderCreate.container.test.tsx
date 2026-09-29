import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import MobileOrderCreateContainer from './MobileOrderCreate.container';

describe('MobileOrderCreateContainer', () => {
  it('should render successfully', () => {
    const { container } = render(
      <MemoryRouter>
        <MobileOrderCreateContainer />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
  });
});
