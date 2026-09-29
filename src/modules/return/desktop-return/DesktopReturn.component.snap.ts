import test from '@/libs/unit-test';

import { DesktopReturnComponent } from './DesktopReturn.component';

const configs = [
  {
    props: {},
    desc: 'Should Render DesktopReturnComponent with default props',
    useHook: true,
  },
];

it('DesktopReturnComponent matches snapshot', () => {
  test.assertSnapshots(DesktopReturnComponent, configs);
});
