import { render, screen } from '@testing-library/react';
import { OrderDetailComponent } from './OrderDetail.component';

describe('OrderDetailComponent', () => {
  it('should render successfully', () => {
    render(
      <OrderDetailComponent 
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
        onCloseDeleteModal={jest.fn()}
        onOpenDeleteModal={jest.fn()}
        onNavigateBack={jest.fn()}
        onNavigateEdit={jest.fn()}
        onDeleteOrder={jest.fn()}
      />
    );
    expect(screen.getByText('ORD-123')).toBeTruthy();
  });
});
