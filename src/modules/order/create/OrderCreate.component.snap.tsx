import { OrderCreateComponent } from './OrderCreate.component';
import type { OrderCreateProps } from './OrderCreate.type';
import test from '../../../libs/unit-test';

const props: OrderCreateProps = {
  isEdit: false,
  existingOrder: null,
  selectedCategories: [],
  selectedItems: [],
  itemDetails: {},
  categoryRemarks: {},
  isCategoryOpen: false,
  categoryRef: { current: document.createElement('div') },
  onNavigateBack: jest.fn(),
  onToggleCategory: jest.fn(),
  onToggleItem: jest.fn(),
  onUpdateQty: jest.fn(),
  onUpdateRemark: jest.fn(),
  onUpdateCategoryRemark: jest.fn(),
  onSubmit: jest.fn(),
  onToggleCategoryOpen: jest.fn(),
};

const configs = [{ props, desc: 'Should Render OrderCreateComponent' }];

test.assertSnapshots(OrderCreateComponent, configs);
