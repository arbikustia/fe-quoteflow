import type * as React from "react";

import test from "@/libs/unit-test";

import type { PaymentDetailState } from "../Payment.type";

import { PaymentDetailComponent } from "./PaymentDetail.component";

jest.mock("@/app/layout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }): React.ReactElement => <div>{children}</div>,
}));
jest.mock("@/app/shared/PageLayout", () => ({
  PageLayout: ({ children, title }: { children: React.ReactNode; title: string }): React.ReactElement => <section><h1>{title}</h1>{children}</section>,
}));

const props: PaymentDetailState = {
  payment: {
    id: "pay-1", invoiceId: "inv-1", paymentMethodId: "BCA", invoiceNo: "INV-001", customerName: "PT Example", amount: 1500000,
    paidAt: "2026-11-01T08:00:00", referenceNo: "REF-1", notes: "Note", status: "active", statusLabel: "Lunas", grandTotal: 1500000, remainingAmount: 0, createdAt: "",
  },
  paymentEntries: [],
  linkedInvoice: null,
  methodName: "BCA",
  isLoading: false,
  errorMessage: null,
  goBack: jest.fn(),
  handleStatus: jest.fn(),
};

test.assertSnapshots(PaymentDetailComponent, [
  { props, desc: "should render the payment detail" },
  { props: { ...props, payment: null, isLoading: true }, desc: "should render the payment detail skeleton" },
  { props: { ...props, payment: null, errorMessage: "Unavailable" }, desc: "should render the payment detail error" },
]);
