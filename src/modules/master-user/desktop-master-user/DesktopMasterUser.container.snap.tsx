import test from '@/libs/unit-test';

import DesktopMasterUserContainer from './DesktopMasterUser.container';

const configs = [
  {
    props: {},
    desc: 'Should Render DesktopMasterUserContainer with default props',
    useHook: true,
  },
];

it('DesktopMasterUserContainer matches snapshot', () => {
  test.assertSnapshots(DesktopMasterUserContainer, configs);
});
