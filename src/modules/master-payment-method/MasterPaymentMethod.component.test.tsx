import * as React from "react";

import test from "../../libs/unit-test";

import { MasterPaymentMethodComponent } from "./MasterPaymentMethod.component";
import type { MasterPaymentMethodProps, PaymentMethodData } from "./MasterPaymentMethod.type";

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
  Pagination: () => <div data-testid="pagination" />,
}));

jest.mock("../../components/Table", () => () => <div data-testid="table" />);

describe("MasterPaymentMethod.component", () => {
  const paymentMethods: PaymentMethodData[] = [
    { id: "pm-1", name: "Transfer Bank", description: "Transfer to bank account", status: "active", createAt: "2023-10-06", createBy: null },
    { id: "pm-2", name: "Credit Card", description: "Pay with credit card", status: "inactive", createAt: "2023-10-06", createBy: null },
  ];
  const defaultProps: MasterPaymentMethodProps = {
    paginatedData: paymentMethods,
    currentPage: 1,
    totalPages: 5,
    pageSize: 10,
    totalCount: 50,
    isLoading: false,
    errorMessage: null,
    isMissingData: false,
    isEmpty: false,
    setSearchTerm: jest.fn(),
    goToPage: jest.fn(),
    nextPage: jest.fn(),
    prevPage: jest.fn(),
    changePageSize: jest.fn(),
    onBack: jest.fn(),
    onCreate: jest.fn(),
    onEdit: jest.fn(),
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
