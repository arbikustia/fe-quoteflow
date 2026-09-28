import test from '@/libs/unit-test';

import MasterUserContainer from './MasterUser.container';

const configs = [
  {
    props: {},
    desc: 'Should Render MasterUserContainer with default props',
    useHook: true,
  },
];

it('MasterUserContainer matches snapshot', () => {
  test.assertSnapshots(MasterUserContainer, configs);
});
