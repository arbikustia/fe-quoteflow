import test from '@/libs/unit-test';

import DesktopReportContainer from './DesktopReport.container';

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
