import { render, screen, fireEvent } from '@testing-library/react';
import { MobileDashboardComponent } from './MobileDashboard.component';

describe('MobileDashboardComponent Test', () => {
  it('Should call onAddOrder when Add New Order button is clicked', () => {
    const mockOnAddOrder = jest.fn();
    const mockOnOrderReport = jest.fn();

    render(
      <MobileDashboardComponent 
        onAddOrder={mockOnAddOrder}
        onOrderReport={mockOnOrderReport}
        statuses={[]}
      />
    );

    const addBtn = screen.getByText(/Add New/i).closest('button');
    if (addBtn) {
      fireEvent.click(addBtn);
    }
    
    expect(mockOnAddOrder).toHaveBeenCalledTimes(1);
  });

  it('Should call onOrderReport when Order Report button is clicked', () => {
    const mockOnAddOrder = jest.fn();
    const mockOnOrderReport = jest.fn();

    render(
      <MobileDashboardComponent 
        onAddOrder={mockOnAddOrder}
        onOrderReport={mockOnOrderReport}
        statuses={[]}
      />
    );

    const buttons = screen.getAllByRole('button');
    if (buttons[1]) {
      fireEvent.click(buttons[1]);
    }
    
    expect(mockOnOrderReport).toHaveBeenCalled();
  });
});
