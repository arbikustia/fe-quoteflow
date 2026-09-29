import type { Mock } from 'vitest';
import { vi } from 'vitest';

import test from '../../../libs/unit-test';

import DesktopDashboardContainer from './DesktopDashboard.container';

/**
 * Mock effect
 * @returns {{ handleNewOrder: Mock; handleReturn: Mock }} - mock hook return
 */
const mockUseDesktopDashboardEffect = (): { handleNewOrder: Mock; handleReturn: Mock } => ({
  handleNewOrder: vi.fn(),
  handleReturn: vi.fn()
});

/**
 * Mock hook module factory
 * @returns {{ useDesktopDashboardEffect: () => { handleNewOrder: Mock; handleReturn: Mock } }} - mock module
 */
const mockModuleFactory = (): { useDesktopDashboardEffect: () => { handleNewOrder: Mock; handleReturn: Mock } } => ({
  useDesktopDashboardEffect: mockUseDesktopDashboardEffect
});

vi.mock('./DesktopDashboard.hook', mockModuleFactory);

const configs = [
  {
    props: {},
    desc: 'Should Render DesktopDashboardContainer'
  }
];

test.assertSnapshots(DesktopDashboardContainer, configs);
