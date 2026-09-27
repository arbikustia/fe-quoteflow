import test from '@/libs/unit-test';

import { OrderPageComponent } from './OrderPage.component';

const configs = [
  {
    props: {},
    desc: 'Should Render OrderPageComponent with default props',
    useHook: true,
  },
];

it('OrderPageComponent matches snapshot', () => {
  test.assertSnapshots(OrderPageComponent, configs);
});
