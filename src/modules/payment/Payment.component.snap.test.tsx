import type * as React from "react";

import test from "@/libs/unit-test";

import { PaymentComponent } from "./Payment.component";
import type { PaymentProps } from "./Payment.type";

jest.mock("@/app/layout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }): React.ReactElement => <div>{children}</div>,
}));
jest.mock("@/app/shared/PageLayout", () => ({
  PageLayout: ({ children, title }: { children: React.ReactNode; title: string }): React.ReactElement => <section><h1>{title}</h1>{children}</section>,
}));

const props: PaymentProps = {
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  paginatedData: [{
    id: "pay-1", invoiceId: "inv-1", paymentMethodId: "pm-1", invoiceNo: "INV-001", customerName: "ADE PUTRI", amount: 1000000,
    paidAt: "2026-11-01T08:00:00", referenceNo: "", notes: "", status: "active", statusLabel: "Paid", grandTotal: 1000000, remainingAmount: 0, createdAt: "",
  }],
  totalCount: 1,
  isLoading: false,
  errorMessage: null,
  isMissingData: false,
  isEmpty: false,
  goToPage: jest.fn(),
  changePageSize: jest.fn(),
  setSearchTerm: jest.fn(),
  onBack: jest.fn(),
  onCreate: jest.fn(),
  onDetail: jest.fn(),
  onRowClick: jest.fn(),
};

test.assertSnapshots(PaymentComponent, [
  { props, desc: "should render the payment list" },
  { props: { ...props, isLoading: true }, desc: "should render the payment list skeletons" },
  { props: { ...props, paginatedData: [], isEmpty: true }, desc: "should render the empty payment list" },
]);
