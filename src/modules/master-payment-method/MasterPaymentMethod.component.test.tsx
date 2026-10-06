import * as React from "react";
import { describe, vi } from "vitest";
import { MasterPaymentMethodComponent } from "./MasterPaymentMethod.component";
import test from "../../libs/unit-test";

vi.mock("../../app/layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}));

vi.mock("../../components/Icons", () => ({
  Icons: { Search: () => <div data-testid="icon-search" /> },
}));

vi.mock("../../components/MobileList", () => ({
  MobileList: () => <div data-testid="mobile-list" />,
}));

vi.mock("../../components/Pagination", () => ({
  PaginationFooter: () => <div data-testid="pagination-footer" />,
  PaginationHeader: () => <div data-testid="pagination-header" />,
}));

vi.mock("../../components/Table", () => ({
  default: () => <div data-testid="table" />,
}));

describe("MasterPaymentMethod.component", () => {
  const defaultProps = {
    paginatedData: [
      { id: "pm-1", name: "Transfer Bank", description: "Transfer to bank account", status: "active", createAt: "2023-10-06" },
      { id: "pm-2", name: "Credit Card", description: "Pay with credit card", status: "inactive", createAt: "2023-10-06" },
    ] as any[],
    columns: [],
    currentPage: 1,
    totalPages: 5,
    pageSize: 10,
    totalCount: 50,
    goToPage: vi.fn(),
    nextPage: vi.fn(),
    prevPage: vi.fn(),
    changePageSize: vi.fn(),
    onBack: vi.fn(),
    onCreate: vi.fn(),
    onEdit: vi.fn(),
    onRowClick: vi.fn(),
    onMore: vi.fn(),
    isMoreOpen: false,
    onCloseMore: vi.fn(),
    onDelete: vi.fn(),
  };

  test.assertSnapshots(MasterPaymentMethodComponent, [
    {
      props: defaultProps,
      desc: "default state",
    },
    {
      props: { ...defaultProps, isMoreOpen: true },
      desc: "more open state",
    },
  ]);
});
