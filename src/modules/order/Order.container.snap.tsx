import test from '@/libs/unit-test';

import OrderContainer from './Order.container';

const configs = [
  {
    props: {},
    desc: 'Should Render OrderContainer with default props',
    useHook: true,
  },
];

it('OrderContainer matches snapshot', () => {
  test.assertSnapshots(OrderContainer, configs);
});
