import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import MobileOrderDetailContainer from './MobileOrderDetail.container';

describe('MobileOrderDetailContainer', () => {
  it('should render successfully', () => {
    const { container } = render(
      <MemoryRouter>
        <MobileOrderDetailContainer />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
  });
});
