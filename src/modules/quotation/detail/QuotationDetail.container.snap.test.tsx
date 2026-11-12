import type * as React from "react";

import test from "@/libs/unit-test";

import QuotationDetailContainer from "./QuotationDetail.container";

jest.mock("./QuotationDetail.hook", () => ({
  /**
   * Return empty detail state.
   * @returns {Record<string, never>} - Empty state
   */
  useQuotationDetail: (): Record<string, never> => ({}),
}));
jest.mock("./QuotationDetail.component", () => ({
  /**
   * Render the mocked detail page.
   * @returns {React.ReactElement} - Mocked page
   */
  QuotationDetailComponent: (): React.ReactElement => <div>Quotation detail</div>,
}));

test.assertSnapshots(QuotationDetailContainer, [{ props: {}, desc: "should render the quotation detail" }]);
