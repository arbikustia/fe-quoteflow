import test from '../../../libs/unit-test';

import { OrderDetailComponent } from './OrderDetail.component';
import type { OrderDetailProps } from './OrderDetail.type';

jest.useFakeTimers();
jest.setSystemTime(new Date("2026-10-22T18:45:00+07:00"));

afterAll(() => jest.useRealTimers());

const props: OrderDetailProps = {
  order: {
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
  },
  projects: [],
  isLoading: false,
  errorMessage: null,
  onNavigateBack: jest.fn(),
  onEdit: jest.fn(),
};

const configs = [{ props, desc: 'Should Render OrderDetailComponent' }];

test.assertSnapshots(OrderDetailComponent, configs);
