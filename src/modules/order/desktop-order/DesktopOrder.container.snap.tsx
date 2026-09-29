import test from '@/libs/unit-test';

import DesktopOrderContainer from './DesktopOrder.container';

const configs = [
  {
    props: {},
    desc: 'Should Render DesktopOrderContainer with default props',
    useHook: true,
  },
];

it('DesktopOrderContainer matches snapshot', () => {
  test.assertSnapshots(DesktopOrderContainer, configs);
});
