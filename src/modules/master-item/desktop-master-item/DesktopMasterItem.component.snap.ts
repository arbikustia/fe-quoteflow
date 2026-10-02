import test from '@/libs/unit-test';

import { DesktopMasterItemComponent } from './DesktopMasterItem.component';

const configs = [
  {
    props: {},
    desc: 'Should Render DesktopMasterItemComponent with default props',
    useHook: true,
  },
];

it('DesktopMasterItemComponent matches snapshot', () => {
  test.assertSnapshots(DesktopMasterItemComponent, configs);
});
