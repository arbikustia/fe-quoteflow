import { render, screen } from '@testing-library/react';
import { MobileOrderCreateComponent } from './MobileOrderCreate.component';
import React from 'react';

describe('MobileOrderCreateComponent', () => {
  it('should render successfully', () => {
    const mockRef = { current: document.createElement('div') };
    render(
      <MobileOrderCreateComponent 
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
