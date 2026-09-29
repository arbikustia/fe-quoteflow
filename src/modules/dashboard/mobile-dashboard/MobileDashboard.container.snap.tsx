import type { Mock } from 'vitest';
import { vi } from 'vitest';

import test from '../../../libs/unit-test';

import MobileDashboardContainer from './MobileDashboard.container';

/**
 * Mock mobile dashboard effect
 * @returns {{ handleAddOrder: Mock; handleOrderReport: Mock }} - mock hook return
 */
const mockUseMobileDashboardEffect = (): { handleAddOrder: Mock; handleOrderReport: Mock } => ({
  handleAddOrder: vi.fn(),
  handleOrderReport: vi.fn()
});

/**
 * Mock hook module factory
 * @returns {{ useMobileDashboardEffect: () => { handleAddOrder: Mock; handleOrderReport: Mock } }} - mock module
 */
const mockModuleFactory = (): { useMobileDashboardEffect: () => { handleAddOrder: Mock; handleOrderReport: Mock } } => ({
  useMobileDashboardEffect: mockUseMobileDashboardEffect
});

vi.mock('./MobileDashboard.hook', mockModuleFactory);

const configs = [
  {
    props: {},
    desc: 'Should Render MobileDashboardContainer with default behavior'
  }
];

test.assertSnapshots(MobileDashboardContainer, configs);
