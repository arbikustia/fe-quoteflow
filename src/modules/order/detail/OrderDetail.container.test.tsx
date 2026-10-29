import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('@/services/order.service', () => ({
  useGetOrderByIdQuery: (): { data: undefined; error: undefined; isLoading: boolean } => ({ data: undefined, error: undefined, isLoading: false }),
}));

jest.mock('@/services/master-project.service', () => ({
  mapProject: jest.fn(),
  useGetAllProjectsQuery: (): { data: undefined } => ({ data: undefined }),
}));

import OrderDetailContainer from './OrderDetail.container';

describe('OrderDetailContainer', () => {
  it('should render successfully', () => {
    const { container } = render(
      <MemoryRouter>
        <OrderDetailContainer />
      </MemoryRouter>,
    );

    expect(container).toBeTruthy();
  });
});
