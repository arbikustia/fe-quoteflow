import { MobileOrderCreateComponent } from './MobileOrderCreate.component';
import type { MobileOrderCreateProps } from './MobileOrderCreate.type';
import test from '../../../libs/unit-test';

const props: MobileOrderCreateProps = {
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

const configs = [{ props, desc: 'Should Render MobileOrderCreateComponent' }];

test.assertSnapshots(MobileOrderCreateComponent, configs);
