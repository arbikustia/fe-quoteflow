import test from '../../../libs/unit-test';

jest.mock('@/services/order.service', () => ({
  /**
   *
 * @returns {void} Snapshot assertion
   */
  useGetOrderByIdQuery: (): { data: undefined; error: undefined; isLoading: boolean } => ({ data: undefined, error: undefined, isLoading: false }),
}));

import OrderDetailContainer from './OrderDetail.container';

jest.useFakeTimers();
jest.setSystemTime(new Date("2026-10-22T18:45:00+07:00"));

afterAll(() => jest.useRealTimers());

const configs = [
  {
    props: {},
    desc: 'Should Render OrderDetailContainer',
  },
];

test.assertSnapshots(OrderDetailContainer, configs);
