import type * as React from "react";

import test from "@/libs/unit-test";

import QuotationStatusContainer from "./QuotationStatus.container";

jest.mock("./QuotationStatus.hook", () => ({
  /**
   * Return empty form state.
   * @returns {Record<string, never>} - Empty state
   */
  useQuotationStatusForm: (): Record<string, never> => ({}),
}));
jest.mock("./QuotationStatus.component", () => ({
  /**
   * Render the mocked form.
   * @returns {React.ReactElement} - Mocked form
   */
  QuotationStatusForm: (): React.ReactElement => <div>Status form</div>,
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

test.assertSnapshots(QuotationStatusContainer, [{ props: {}, desc: "should render the quotation status form" }]);
