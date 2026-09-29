import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MobileOrderCreateComponent } from './MobileOrderCreate.component';
import React from 'react';

describe('MobileOrderCreateComponent', () => {
  it('should render successfully', () => {
    const mockRef = React.createRef<HTMLDivElement>();
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
        onNavigateBack={vi.fn()}
        onToggleCategory={vi.fn()}
        onToggleItem={vi.fn()}
        onUpdateQty={vi.fn()}
        onUpdateRemark={vi.fn()}
        onUpdateCategoryRemark={vi.fn()}
        onSubmit={vi.fn()}
        onToggleCategoryOpen={vi.fn()}
      />
    );
    expect(screen.getByText('New Request')).toBeTruthy();
  });
});
