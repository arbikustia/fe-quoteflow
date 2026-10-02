import test from '@/libs/unit-test';

import DesktopMasterItemContainer from './DesktopMasterItem.container';

const configs = [
  {
    props: {},
    desc: 'Should Render DesktopMasterItemContainer with default props',
    useHook: true,
  },
];

it('DesktopMasterItemContainer matches snapshot', () => {
  test.assertSnapshots(DesktopMasterItemContainer, configs);
});
