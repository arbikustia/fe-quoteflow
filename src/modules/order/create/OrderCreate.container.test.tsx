import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OrderCreateContainer from './OrderCreate.container';

describe('OrderCreateContainer', () => {
  it('should render successfully', () => {
    const { container } = render(
      <MemoryRouter>
        <OrderCreateContainer />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
  });
});
