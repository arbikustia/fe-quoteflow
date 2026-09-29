
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DesktopDashboardComponent } from './DesktopDashboard.component';
import { MemoryRouter } from 'react-router-dom';

describe('DesktopDashboardComponent Test', () => {
  it('Should call onNewOrder when New Order button is clicked', () => {
    const mockOnNewOrder = vi.fn();
    const mockOnReturn = vi.fn();

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
