import MobileDashboardContainer from './MobileDashboard.container';
import test from '../../../libs/unit-test';

jest.mock('./MobileDashboard.hook', () => ({
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
