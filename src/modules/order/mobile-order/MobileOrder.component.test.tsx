import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MobileOrderComponent } from './MobileOrder.component';

describe('MobileOrderComponent', () => {
  it('should render successfully', () => {
    render(<MobileOrderComponent quotes={[]} onNavigate={vi.fn()} />);
    expect(screen.getByText('Order History')).toBeTruthy();
  });
});
