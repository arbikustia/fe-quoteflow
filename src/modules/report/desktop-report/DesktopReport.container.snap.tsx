import test from '@/libs/unit-test';

import DesktopReportContainer from './DesktopReport.container';

beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-10-27T01:18:28'));
});

afterAll(() => {
  jest.useRealTimers();
});

const configs = [
  {
    props: {},
    desc: 'Should Render DesktopReportContainer with default props',
    useHook: true,
  },
];

it('DesktopReportContainer matches snapshot', () => {
  test.assertSnapshots(DesktopReportContainer, configs);
});
