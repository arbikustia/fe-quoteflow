import DesktopDashboardContainer from './DesktopDashboard.container';
import test from '../../../libs/unit-test';

jest.mock('./DesktopDashboard.hook', () => ({
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
