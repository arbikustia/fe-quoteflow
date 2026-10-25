import * as React from "react";

import test from "../../libs/unit-test";

import { MasterPaymentTypeComponent } from "./MasterPaymentType.component";
import type { MasterPaymentTypeProps, PaymentTypeData } from "./MasterPaymentType.type";

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

describe("MasterPaymentType Component", () => {
  const paymentTypes: PaymentTypeData[] = [
    { id: "1", name: "PT 1", status: "active", createAt: "2024-01-01", createBy: "Admin" },
    { id: "2", name: "PT 2", status: "inactive", createAt: "2024-01-02", createBy: "Admin" },
  ];

  const mockProps: MasterPaymentTypeProps = {
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    paginatedData: paymentTypes,
    isLoading: false,
    errorMessage: null,
    isMissingData: false,
    isEmpty: false,
    setSearchTerm: jest.fn(),
    goToPage: jest.fn(),
    nextPage: jest.fn(),
    prevPage: jest.fn(),
    changePageSize: jest.fn(),
    totalCount: 2,
    onCreate: jest.fn(),
    onEdit: jest.fn(),
    onBack: jest.fn(),
  };

  test.assertSnapshots(MasterPaymentTypeComponent, [
    {
      props: mockProps,
      desc: "default state",
    },
  ]);
});
