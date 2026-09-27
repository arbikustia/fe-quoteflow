import test from '@/libs/unit-test';

import ReturnContainer from './Return.container';

const configs = [
  {
    props: {},
    desc: 'Should Render ReturnContainer with default props',
    useHook: true,
  },
];

it('ReturnContainer matches snapshot', () => {
  test.assertSnapshots(ReturnContainer, configs);
});
