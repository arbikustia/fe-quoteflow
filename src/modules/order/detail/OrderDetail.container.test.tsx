import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const mockOrder = {
  id: "ORD-123",
  service_type_id: "SERVICE-1",
  service_type_name: "Delivery",
  customer_name: "Test Customer",
  customer_phone: "08123456789",
  address: "Test Location",
  event_name: "Test Event",
  start_at: "2024-01-01T00:00:00Z",
  end_at: "2024-01-02T00:00:00Z",
  subtotal: 100000,
  service_fee: 10000,
  discount: 5000,
  grand_total: 105000,
  status: 1,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
  rental_transaction_items: [{ item_id: "ITEM-1", item_name: "Spotlight", qty: 1, price: 100000, subtotal: 100000, remark: "Careful" }],
  rental_transaction_project: [],
};

jest.mock('@/services/order.service', () => ({
  useGetOrderByIdQuery: (): { data: { status: boolean; data: typeof mockOrder }; error: undefined; isLoading: boolean } => ({
    data: { status: true, data: mockOrder },
    error: undefined,
    isLoading: false,
  }),
}));

jest.mock('@/services/master-project.service', () => ({
  mapProject: jest.fn(),
  useGetAllProjectsQuery: (): { data: undefined } => ({ data: undefined }),
}));

import OrderDetailContainer from './OrderDetail.container';

describe('OrderDetailContainer', () => {
  it('should render successfully with edit button by default', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/order/detail/ORD-123']}>
        <Routes>
          <Route path="/order/detail/:id" element={<OrderDetailContainer />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(container).toBeTruthy();
    expect(screen.getAllByRole('button', { name: 'Edit' }).length).toBeGreaterThan(0);
  });

  it('should omit edit button when accessed from report via state', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/order/detail/ORD-123', state: { from: 'report' } }]}>
        <Routes>
          <Route path="/order/detail/:id" element={<OrderDetailContainer />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryAllByRole('button', { name: 'Edit' })).toHaveLength(0);
  });

  it('should omit edit button when accessed from report via search params', () => {
    render(
      <MemoryRouter initialEntries={['/order/detail/ORD-123?from=report']}>
        <Routes>
          <Route path="/order/detail/:id" element={<OrderDetailContainer />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryAllByRole('button', { name: 'Edit' })).toHaveLength(0);
  });
});
