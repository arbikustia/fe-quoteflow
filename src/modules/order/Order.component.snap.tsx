import test from '@/libs/unit-test';

import { OrderComponent } from './Order.component';
import type { OrderProps } from './Order.type';

jest.useFakeTimers();
jest.setSystemTime(new Date("2026-10-22T18:45:00+07:00"));

afterAll(() => jest.useRealTimers());

const props: OrderProps = {
  openCreateModal: jest.fn(),
  openEditModal: jest.fn(),
  onRowClick: jest.fn(),
  onBack: jest.fn(),
  columns: [],
  paginatedData: [],
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  totalCount: 0,
  isLoading: false,
  errorMessage: null,
  isEmpty: true,
  goToPage: jest.fn(),
  changePageSize: jest.fn(),
  setSearchTerm: jest.fn(),
};

const configs = [{ props, desc: 'Should Render OrderComponent with empty data' }];

it('OrderComponent matches snapshot', () => {
  test.assertSnapshots(OrderComponent, configs);
});
