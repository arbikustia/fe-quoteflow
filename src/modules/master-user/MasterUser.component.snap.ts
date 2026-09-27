import test from '@/libs/unit-test';
import { MasterUserComponent } from './MasterUser.component';

const configs = [
  {
    props: {},
    desc: 'Should Render MasterUserComponent with default props',
    useHook: true,
  },
];

it('MasterUserComponent matches snapshot', () => {
  test.assertSnapshots(MasterUserComponent, configs);
});
