import type * as React from "react";

import { render, screen } from "@/libs/unit-test";

import QuotationStatusContainer from "./QuotationStatus.container";

jest.mock("./QuotationStatus.hook", () => ({
  /**
   * Return form state.
   * @returns {{ quotationNumber: string }} - Form state
   */
  useQuotationStatusForm: (): { quotationNumber: string } => ({ quotationNumber: "QUO-009" }),
}));
jest.mock("./QuotationStatus.component", () => ({
  /**
   * Render the quotation number.
   * @param {{ quotationNumber: string }} props - Form state
   * @returns {React.ReactElement} - Mocked form
   */
  QuotationStatusForm: (props: { quotationNumber: string }): React.ReactElement => <div>{props.quotationNumber}</div>,
}));
jest.mock("@/app/layout", () => ({
  __esModule: true,
  /**
   * Render children only.
   * @param {{ children: React.ReactNode }} props - Layout props
   * @returns {React.ReactElement} - Mocked layout
   */
  default: ({ children }: { children: React.ReactNode }): React.ReactElement => <div>{children}</div>,
}));

describe("QuotationStatusContainer", (): void => {
  it("should pass the hook state to the form", (): void => {
    render(<QuotationStatusContainer />);

    expect(screen.getByText("QUO-009")).toBeTruthy();
  });
});
