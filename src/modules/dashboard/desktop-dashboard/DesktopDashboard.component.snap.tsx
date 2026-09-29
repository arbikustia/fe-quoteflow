import test from '../../../libs/unit-test';

import { DesktopDashboardComponent } from './DesktopDashboard.component';
import type { DesktopDashboardProps } from './DesktopDashboard.type';

/**
 * mock new order
 * @returns {void} void
 */
const mockOnNewOrder = (): void => {};

/**
 * mock return
 * @returns {void} void
 */
const mockOnReturn = (): void => {};

const mockProps: DesktopDashboardProps = {
  quotes: [],
  onNewOrder: mockOnNewOrder,
  onReturn: mockOnReturn
};

const configs = [
  {
    props: mockProps,
    desc: 'Should Render DesktopDashboardComponent'
  }
];

test.assertSnapshots(DesktopDashboardComponent, configs);
