import test from '@/libs/unit-test';

jest.mock("@/app/layout", () => ({
  __esModule: true,
  /**
   * Render a plain wrapper around children.
   *
   * @param {React.PropsWithChildren} props - Layout props
   * @returns {React.ReactElement} Wrapper element
   */
  default: (props: React.PropsWithChildren): React.ReactElement => <div>{props.children}</div>,
}));

jest.useFakeTimers();
jest.setSystemTime(new Date("2026-10-22T18:45:00+07:00"));

afterAll(() => jest.useRealTimers());

jest.mock('@/services/order.service', () => ({
  /**
   *
 * @returns {void} Snapshot assertion
   */
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
