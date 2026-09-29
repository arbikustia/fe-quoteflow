import test from '../../../libs/unit-test';

import { DesktopDashboardComponent } from './DesktopDashboard.component';
import type { DesktopDashboardProps } from './DesktopDashboard.type';

const mockProps: DesktopDashboardProps = {
  quotes: [],
  /**
   *
   */
  onNewOrder: () => {},
  /**
   *
   */
  onReturn: () => {}
};

const configs = [
  {
    props: mockProps,
    desc: 'Should Render DesktopDashboardComponent'
  }
];

test.assertSnapshots(DesktopDashboardComponent, configs);
