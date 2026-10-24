import test from '@/libs/unit-test';

jest.useFakeTimers();
jest.setSystemTime(new Date("2026-10-22T18:45:00+07:00"));

afterAll(() => jest.useRealTimers());

jest.mock('@/services/order.service', () => ({
  useGetOrdersQuery: (): { data: undefined; error: undefined; isLoading: boolean } => ({ data: undefined, error: undefined, isLoading: false }),
}));

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
