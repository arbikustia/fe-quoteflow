import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MobileDashboardContainer from './MobileDashboard.container';

vi.mock('./MobileDashboard.hook', () => ({
  useMobileDashboardEffect: () => ({
    handleAddOrder: vi.fn(),
    handleOrderReport: vi.fn()
  })
}));

describe('MobileDashboardContainer Test', () => {
  it('Should render container successfully without crashing', () => {
    const { container } = render(<MobileDashboardContainer />);
    
    expect(container).toBeTruthy();
  });
});
