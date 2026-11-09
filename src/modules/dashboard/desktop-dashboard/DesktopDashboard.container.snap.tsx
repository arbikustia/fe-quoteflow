import test from '../../../libs/unit-test';

import DesktopDashboardContainer from './DesktopDashboard.container';

jest.mock('./DesktopDashboard.hook', () => ({
  /**
   * Mock desktop dashboard effect hook
   * @returns {object} - mock return
   */
  useDesktopDashboardEffect: (): { handleNewOrder: jest.Mock; handleReturn: jest.Mock } => ({
    handleNewOrder: jest.fn(),
    handleReturn: jest.fn(),
  }),
}));

const configs = [
  {
    props: {},
    desc: 'Should Render DesktopDashboardContainer'
  }
];

test.assertSnapshots(DesktopDashboardContainer, configs);
