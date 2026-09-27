import test from '@/libs/unit-test';
import { ReportComponent } from './Report.component';

const configs = [
  {
    props: {},
    desc: 'Should Render ReportComponent with default props',
    useHook: true,
  },
];

it('ReportComponent matches snapshot', () => {
  test.assertSnapshots(ReportComponent, configs);
});
