import test from '@/libs/unit-test';

import { ReturnComponent } from './Return.component';

const configs = [
  {
    props: {},
    desc: 'Should Render ReturnComponent with default props',
    useHook: true,
  },
];

it('ReturnComponent matches snapshot', () => {
  test.assertSnapshots(ReturnComponent, configs);
});
