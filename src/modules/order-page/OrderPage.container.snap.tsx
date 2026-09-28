import test from '@/libs/unit-test';

import OrderPageContainer from './OrderPage.container';

const configs = [
  {
    props: {},
    desc: 'Should Render OrderPageContainer with default props',
    useHook: true,
  },
];

it('OrderPageContainer matches snapshot', () => {
  test.assertSnapshots(OrderPageContainer, configs);
});
