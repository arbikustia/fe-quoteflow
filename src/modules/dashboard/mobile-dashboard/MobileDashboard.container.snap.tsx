import test from '../../../libs/unit-test';

import MobileDashboardContainer from './MobileDashboard.container';

jest.mock('./MobileDashboard.hook', () => ({
  /**
   * Mock mobile dashboard effect hook
   * @returns {object} - mock return
   */
  useMobileDashboardEffect: (): { handleAddOrder: jest.Mock; handleOrderReport: jest.Mock } => ({
    handleAddOrder: jest.fn(),
    handleOrderReport: jest.fn(),
  }),
}));

const configs = [
  {
    props: {},
    desc: 'Should Render MobileDashboardContainer with default behavior'
  }
];

test.assertSnapshots(MobileDashboardContainer, configs);
