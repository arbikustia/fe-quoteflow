import test from '@/libs/unit-test';

import { DesktopReportComponent } from './DesktopReport.component';

const configs = [
  {
    props: {},
    desc: 'Should Render DesktopReportComponent with default props',
    useHook: true,
  },
];

it('DesktopReportComponent matches snapshot', () => {
  test.assertSnapshots(DesktopReportComponent, configs);
});
