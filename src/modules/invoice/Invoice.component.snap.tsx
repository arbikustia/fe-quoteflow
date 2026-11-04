jest.useFakeTimers();
jest.setSystemTime(new Date("2026-10-27T12:00:00+07:00"));

import test from "@/libs/unit-test";

import { InvoiceComponent } from "./Invoice.component";
import type { InvoiceProps } from "./Invoice.type";

jest.mock("@/app/layout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("@/app/shared/PageLayout", () => ({
  PageLayout: ({ children, title }: { children: React.ReactNode; title: string }) => (
    <section><h1>{title}</h1>{children}</section>
  ),
}));

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

test.assertSnapshots(InvoiceComponent, [
  { props, desc: "Should render InvoiceComponent with empty data" },
  { props: { ...props, isLoading: true, isEmpty: false }, desc: "Should render InvoiceComponent loading skeletons" },
]);
