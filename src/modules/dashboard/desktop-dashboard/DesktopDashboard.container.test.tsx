
import { render } from '@testing-library/react';
import DesktopDashboardContainer from './DesktopDashboard.container';
import { MemoryRouter } from 'react-router-dom';

jest.mock('./DesktopDashboard.hook', (): { useDesktopDashboardEffect: () => { handleNewOrder: unknown; handleReturn: unknown } } => ({
  useDesktopDashboardEffect: (): { handleNewOrder: unknown; handleReturn: unknown } => ({
    handleNewOrder: jest.fn(),
    handleReturn: jest.fn()
  })
}));

describe('DesktopDashboardContainer Test', () => {
  it('Should render container successfully without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <DesktopDashboardContainer />
      </MemoryRouter>
    );
    
    expect(container).toBeTruthy();
  });
});
