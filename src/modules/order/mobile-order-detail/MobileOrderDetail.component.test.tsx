import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MobileOrderDetailComponent } from './MobileOrderDetail.component';

describe('MobileOrderDetailComponent', () => {
  it('should render successfully', () => {
    render(
      <MobileOrderDetailComponent 
        order={{
          id: "ORD-123",
          name: "Test Name",
          location: "Test Location",
          startDate: "2024-01-01",
          endDate: "2024-01-02",
          qty: 1,
          category: "Lighting",
          selectedItems: ["Spotlight"],
          status: "Confirmed",
          pph: 0,
          discount: 0,
          remark: "Test remark"
        }}
        isDeleteModalOpen={false}
        onCloseDeleteModal={vi.fn()}
        onOpenDeleteModal={vi.fn()}
        onNavigateBack={vi.fn()}
        onNavigateEdit={vi.fn()}
        onDeleteOrder={vi.fn()}
      />
    );
    expect(screen.getByText('ORD-123')).toBeTruthy();
  });
});
