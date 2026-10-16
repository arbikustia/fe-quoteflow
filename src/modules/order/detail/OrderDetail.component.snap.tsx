import { OrderDetailComponent } from './OrderDetail.component';
import type { OrderDetailProps } from './OrderDetail.type';
import test from '../../../libs/unit-test';

const props: OrderDetailProps = {
  order: {
    id: 'ORD-123',
    name: 'Test Name',
    location: 'Test Location',
    startDate: '2024-01-01',
    endDate: '2024-01-02',
    qty: 1,
    category: 'Lighting',
    selectedItems: ['Spotlight'],
    status: 'Confirmed',
    pph: 0,
    discount: 0,
    remark: 'Test remark',
  },
  isDeleteModalOpen: false,
  onCloseDeleteModal: jest.fn(),
  onOpenDeleteModal: jest.fn(),
  onNavigateBack: jest.fn(),
  onNavigateEdit: jest.fn(),
  onDeleteOrder: jest.fn(),
};

const configs = [{ props, desc: 'Should Render OrderDetailComponent' }];

test.assertSnapshots(OrderDetailComponent, configs);
