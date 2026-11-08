import type * as React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@/libs/unit-test';

import { OrderDetailComponent } from './OrderDetail.component';

jest.mock('@/app/layout', () => ({
  __esModule: true,
  /**
   * Render mocked layout.
   * @param {{ children: React.ReactNode }} props - layout props
   * @returns {React.ReactElement} mocked layout
   */
  default: ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>,
}));

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
    expect(screen.getAllByRole('button', { name: 'Edit' }).length).toBeGreaterThan(0);
  });

  it('should not render edit button when onEdit is not provided', () => {
    render(
      <MemoryRouter>
        <OrderDetailComponent order={order} projects={[]} isLoading={false} errorMessage={null} onNavigateBack={jest.fn()} />
      </MemoryRouter>,
    );

    expect(screen.queryAllByRole('button', { name: 'Edit' })).toHaveLength(0);
  });
});
