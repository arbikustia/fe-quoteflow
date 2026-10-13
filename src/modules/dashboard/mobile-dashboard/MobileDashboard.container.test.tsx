import { render } from '@testing-library/react';
import MobileDashboardContainer from './MobileDashboard.container';

jest.mock('./MobileDashboard.hook', () => ({
  useMobileDashboardEffect: () => ({
    handleAddOrder: jest.fn(),
    handleOrderReport: jest.fn()
  })
}));

describe('MobileDashboardContainer Test', () => {
  it('Should render container successfully without crashing', () => {
    const { container } = render(<MobileDashboardContainer />);
    
    expect(container).toBeTruthy();
  });
});
