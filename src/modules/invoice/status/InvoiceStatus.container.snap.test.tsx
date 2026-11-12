import type * as React from "react";

import test from "@/libs/unit-test";

import InvoiceStatusContainer from "./InvoiceStatus.container";

jest.mock("./InvoiceStatus.hook", () => ({ useInvoiceStatusForm: (): Record<string, never> => ({}) }));
jest.mock("./InvoiceStatus.component", () => ({
  InvoiceStatusForm: (): React.ReactElement => <div>Status form</div>,
}));
jest.mock("@/app/layout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }): React.ReactElement => <div>{children}</div>,
}));

test.assertSnapshots(InvoiceStatusContainer, [{ props: {}, desc: "should render the invoice status form" }]);
