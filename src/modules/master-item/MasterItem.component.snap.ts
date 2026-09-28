import test from '@/libs/unit-test';

import { MasterItemComponent } from './MasterItem.component';

const configs = [
  {
    props: {},
    desc: 'Should Render MasterItemComponent with default props',
    useHook: true,
  },
];

it('MasterItemComponent matches snapshot', () => {
  test.assertSnapshots(MasterItemComponent, configs);
});
