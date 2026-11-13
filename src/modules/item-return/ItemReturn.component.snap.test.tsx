import type * as React from "react";

import test from "@/libs/unit-test";

import { ItemReturnComponent } from "./ItemReturn.component";
import type { ReturnListState } from "./ItemReturn.type";

jest.mock("@/app/layout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }): React.ReactElement => <div>{children}</div>,
}));

const mockProps: ReturnListState = {
  currentPage: 1,
  totalPages: 2,
  pageSize: 10,
  totalCount: 15,
  rows: [{ id: "return-1", customerName: "Customer Name", returnDate: "2026-11-03T10:00:00", itemCount: 3, notes: "Semua lengkap", status: "active" }],
  isLoading: false,
  errorMessage: null,
  isEmpty: false,
  setSearchTerm: jest.fn(),
  goToPage: jest.fn(),
  changePageSize: jest.fn(),
  onCreate: jest.fn(),
  onEdit: jest.fn(),
  onRowClick: jest.fn(),
  onBack: jest.fn(),
};

describe("ItemReturnComponent snapshot", () => {
  test.assertSnapshots(ItemReturnComponent, [
    { props: mockProps, desc: "should render return rows" },
    { props: { ...mockProps, isLoading: true, rows: [] }, desc: "should render skeletons" },
    { props: { ...mockProps, rows: [], isEmpty: true }, desc: "should render empty state" },
    { props: { ...mockProps, rows: [], errorMessage: "Failed" }, desc: "should render error state" },
  ]);
});
