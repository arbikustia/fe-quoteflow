import type * as React from 'react';

import test from '../../../libs/unit-test';

jest.mock('@/app/layout', () => ({
  __esModule: true,
  /**
   * Render mocked layout.
   * @param {{ children: React.ReactNode }} props - layout props
   * @returns {React.ReactElement} mocked layout
   */
  default: ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>,
}));

jest.mock('@/services/order.service', () => ({
  /**
   *
 * @returns {void} Snapshot assertion
   */
  useGetOrderByIdQuery: (): { data: undefined; error: undefined; isLoading: boolean } => ({ data: undefined, error: undefined, isLoading: false }),
}));

jest.mock('@/services/master-project.service', () => ({
  /**
   * Mock get all projects query.
   * @returns {{ data: undefined }} query result
   */
  useGetAllProjectsQuery: (): { data: undefined } => ({ data: undefined }),
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
