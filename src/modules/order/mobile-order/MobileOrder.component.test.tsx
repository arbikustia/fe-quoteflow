import { render, screen } from '@testing-library/react';
import { MobileOrderComponent } from './MobileOrder.component';

describe('MobileOrderComponent', () => {
  it('should render successfully', () => {
    render(<MobileOrderComponent quotes={[]} onNavigate={jest.fn()} />);
    expect(screen.getByText('Order History')).toBeTruthy();
  });
});
