import { render, screen } from '@testing-library/react';
import { OrderCreateComponent } from './OrderCreate.component';
import React from 'react';

describe('OrderCreateComponent', () => {
  it('should render successfully', () => {
    const mockRef = { current: document.createElement('div') };
    render(
      <OrderCreateComponent 
        isEdit={false}
        existingOrder={null}
        selectedCategories={[]}
        selectedItems={[]}
        itemDetails={{}}
        categoryRemarks={{}}
        isCategoryOpen={false}
        categoryRef={mockRef}
        onNavigateBack={jest.fn()}
        onToggleCategory={jest.fn()}
        onToggleItem={jest.fn()}
        onUpdateQty={jest.fn()}
        onUpdateRemark={jest.fn()}
        onUpdateCategoryRemark={jest.fn()}
        onSubmit={jest.fn()}
        onToggleCategoryOpen={jest.fn()}
      />
    );
    expect(screen.getByText('New Request')).toBeTruthy();
  });
});
