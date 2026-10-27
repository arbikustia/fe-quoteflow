jest.useFakeTimers();
jest.setSystemTime(new Date("2026-10-27T12:00:00+07:00"));

import test from "@/libs/unit-test";

import { InvoiceComponent } from "./Invoice.component";
import type { InvoiceProps } from "./Invoice.type";

const props: InvoiceProps = {
  currentPage: 1,
  pageSize: 10,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
  isLoading: false,
  isEmpty: true,
  errorMessage: null,
  setSearchTerm: jest.fn(),
  goToPage: jest.fn(),
  changePageSize: jest.fn(),
  onBack: jest.fn(),
  onRowClick: jest.fn(),
  onDetail: jest.fn(),
  onEdit: jest.fn(),
};

test.assertSnapshots(InvoiceComponent, [{ props, desc: "Should render InvoiceComponent with empty data" }]);
