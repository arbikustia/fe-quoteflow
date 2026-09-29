
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DesktopDashboardContainer from './DesktopDashboard.container';
import { MemoryRouter } from 'react-router-dom';

vi.mock('./DesktopDashboard.hook', (): { useDesktopDashboardEffect: () => { handleNewOrder: unknown; handleReturn: unknown } } => ({
  useDesktopDashboardEffect: (): { handleNewOrder: unknown; handleReturn: unknown } => ({
    handleNewOrder: vi.fn(),
    handleReturn: vi.fn()
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
