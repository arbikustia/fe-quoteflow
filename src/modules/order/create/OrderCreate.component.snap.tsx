import test from '../../../libs/unit-test';

import { OrderCreateComponent } from './OrderCreate.component';
import type { OrderCreateProps } from './OrderCreate.type';

jest.useFakeTimers();
jest.setSystemTime(new Date("2026-10-22T18:45:00+07:00"));
afterAll(() => jest.useRealTimers());

const props: OrderCreateProps = {
  form: { customer_id: "", pic_id: "", voucher_id: "", service_type_id: "", service_type_name: "", customer_name: "", customer_phone: "", address: "", event_name: "", start_at: "", end_at: "", subtotal: 0, discount: 0, service_fee: 0, remarks: "", grand_total: 0, status: 1, rental_transaction_items: [] },
  customers: [], pics: [], serviceTypes: [], vouchers: [], projects: [], items: [],
  isCustomersLoading: false, isPicsLoading: false, isServiceTypesLoading: false, isVouchersLoading: false, isProjectsLoading: false, isItemsLoading: false,
  isEdit: false, isSubmitting: false, errorMessage: null, showInformationErrors: false, showItemErrors: false, step: 1,
  onBack: jest.fn(), onNextStep: jest.fn(), onPreviousStep: jest.fn(), onCustomerChange: jest.fn(), onPicChange: jest.fn(), onVoucherChange: jest.fn(), onServiceTypeChange: jest.fn(), onProjectSelect: jest.fn(), onItemSelect: jest.fn(), onToggleItem: jest.fn(), onToggleProject: jest.fn(), onChange: jest.fn(), onItemChange: jest.fn(), onAddItem: jest.fn(), onRemoveItem: jest.fn(), onSubmit: jest.fn(), onPreventSubmit: jest.fn(),
};

test.assertSnapshots(OrderCreateComponent, [{ props, desc: 'Should Render OrderCreateComponent' }]);
