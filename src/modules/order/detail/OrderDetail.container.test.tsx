import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OrderDetailContainer from './OrderDetail.container';

describe('OrderDetailContainer', () => {
  it('should render successfully', () => {
    const { container } = render(
      <MemoryRouter>
        <OrderDetailContainer />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
  });
});
