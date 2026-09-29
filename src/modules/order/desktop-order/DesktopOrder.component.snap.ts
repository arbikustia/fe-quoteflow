import test from '@/libs/unit-test';

import { DesktopOrderComponent } from './DesktopOrder.component';

const configs = [
  {
    props: {},
    desc: 'Should Render DesktopOrderComponent with default props',
    useHook: true,
  },
];

it('DesktopOrderComponent matches snapshot', () => {
  test.assertSnapshots(DesktopOrderComponent, configs);
});
