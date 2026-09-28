import test from '@/libs/unit-test';

import ReportContainer from './Report.container';

const configs = [
  {
    props: {},
    desc: 'Should Render ReportContainer with default props',
    useHook: true,
  },
];

it('ReportContainer matches snapshot', () => {
  test.assertSnapshots(ReportContainer, configs);
});
