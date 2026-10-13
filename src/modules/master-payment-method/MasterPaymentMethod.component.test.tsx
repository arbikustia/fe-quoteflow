import * as React from "react";
import { MasterPaymentMethodComponent } from "./MasterPaymentMethod.component";
import test from "../../libs/unit-test";

jest.mock("../../app/layout", () =>
  ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
);

jest.mock("../../components/Icons", () => ({
  Icons: { Search: () => <div data-testid="icon-search" /> },
}));

jest.mock("../../components/MobileList", () => ({
  MobileList: () => <div data-testid="mobile-list" />,
}));

jest.mock("../../components/Pagination", () => ({
  PaginationFooter: () => <div data-testid="pagination-footer" />,
  PaginationHeader: () => <div data-testid="pagination-header" />,
}));

jest.mock("../../components/Table", () => () => <div data-testid="table" />);

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
    goToPage: jest.fn(),
    nextPage: jest.fn(),
    prevPage: jest.fn(),
    changePageSize: jest.fn(),
    onBack: jest.fn(),
    onCreate: jest.fn(),
    onEdit: jest.fn(),
    onRowClick: jest.fn(),
    onMore: jest.fn(),
    isMoreOpen: false,
    onCloseMore: jest.fn(),
    onDelete: jest.fn(),
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
