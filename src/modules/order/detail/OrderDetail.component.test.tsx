import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { OrderDetailComponent } from './OrderDetail.component';

const order = {
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

describe('OrderDetailComponent', () => {
  it('should render API order detail', () => {
    render(
      <MemoryRouter>
        <OrderDetailComponent order={order} projects={[]} isLoading={false} errorMessage={null} onNavigateBack={jest.fn()} onEdit={jest.fn()} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Test Event')).toBeTruthy();
    expect(screen.getByText('Spotlight')).toBeTruthy();
  });
});
