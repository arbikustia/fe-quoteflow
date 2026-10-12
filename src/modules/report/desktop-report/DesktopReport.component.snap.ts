import test from '@/libs/unit-test';

import { DesktopReportComponent } from './DesktopReport.component';
import type { DesktopReportProps } from './DesktopReport.type';

const props: DesktopReportProps = {
  completedOrders: [],
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  paginatedData: [],
  goToPage: jest.fn(),
  nextPage: jest.fn(),
  prevPage: jest.fn(),
  changePageSize: jest.fn(),
  totalCount: 0,
};

const configs = [{ props, desc: 'Should Render DesktopReportComponent with empty data' }];

it('DesktopReportComponent matches snapshot', () => {
  test.assertSnapshots(DesktopReportComponent, configs);
});
