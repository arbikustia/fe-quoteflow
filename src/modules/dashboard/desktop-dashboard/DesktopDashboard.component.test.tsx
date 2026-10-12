
import { render, screen, fireEvent } from '@testing-library/react';
import { DesktopDashboardComponent } from './DesktopDashboard.component';
import { MemoryRouter } from 'react-router-dom';

describe('DesktopDashboardComponent Test', () => {
  it('Should call onNewOrder when New Order button is clicked', () => {
    const mockOnNewOrder = jest.fn();
    const mockOnReturn = jest.fn();

    render(
      <MemoryRouter>
        <DesktopDashboardComponent 
          quotes={[]}
          onNewOrder={mockOnNewOrder}
          onReturn={mockOnReturn}
        />
      </MemoryRouter>
    );

    const newOrderBtn = screen.getByText(/New Order/i).closest('button');
    if (newOrderBtn) {
      fireEvent.click(newOrderBtn);
    }
    
    expect(mockOnNewOrder).toHaveBeenCalledTimes(1);
  });
});
