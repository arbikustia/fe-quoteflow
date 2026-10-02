import test from '@/libs/unit-test';

import { DesktopMasterUserComponent } from './DesktopMasterUser.component';

const configs = [
  {
    props: {},
    desc: 'Should Render DesktopMasterUserComponent with default props',
    useHook: true,
  },
];

it('DesktopMasterUserComponent matches snapshot', () => {
  test.assertSnapshots(DesktopMasterUserComponent, configs);
});
