import test from '@/libs/unit-test';

import DesktopReturnContainer from './DesktopReturn.container';

const configs = [
  {
    props: {},
    desc: 'Should Render DesktopReturnContainer with default props',
    useHook: true,
  },
];

it('DesktopReturnContainer matches snapshot', () => {
  test.assertSnapshots(DesktopReturnContainer, configs);
});
