import test from '@/libs/unit-test';

import { OrderComponent } from './Order.component';
import type { OrderProps } from './Order.type';

const props: OrderProps = {
  isConfirmModalOpen: false,
  deletingQuote: null,
  openCreateModal: jest.fn(),
  openEditModal: jest.fn(),
  openConfirmModal: jest.fn(),
  closeConfirmModal: jest.fn(),
  onConfirmDelete: jest.fn(),
  activeTab: 'All Orders',
  setActiveTab: jest.fn(),
  statusCounts: { 'All Orders': 0 },
  TABS: ['All Orders'],
  columns: [],
  paginatedData: [],
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  totalCount: 0,
  goToPage: jest.fn(),
  nextPage: jest.fn(),
  prevPage: jest.fn(),
  changePageSize: jest.fn(),
};

const configs = [{ props, desc: 'Should Render OrderComponent with empty data' }];

it('OrderComponent matches snapshot', () => {
  test.assertSnapshots(OrderComponent, configs);
});
