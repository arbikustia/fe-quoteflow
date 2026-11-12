import type * as React from "react";

import test from "@/libs/unit-test";

import QuotationContainer from "./Quotation.container";

jest.mock("./Quotation.hook", () => ({
  /**
   * Return empty pagination state.
   * @returns {Record<string, never>} - Empty state
   */
  useQuotationPagination: (): Record<string, never> => ({}),
  /**
   * Return empty navigation state.
   * @returns {Record<string, never>} - Empty state
   */
  useQuotationNavigation: (): Record<string, never> => ({}),
}));
jest.mock("./Quotation.component", () => ({
  /**
   * Render the mocked quotation list.
   * @returns {React.ReactElement} - Mocked list
   */
  QuotationComponent: (): React.ReactElement => <div>Quotation list</div>,
}));
jest.mock("@/hooks/usePagePermission", () => ({
  /**
   * Allow editing.
   * @returns {{ canEdit: boolean }} - Permission
   */
  usePagePermission: (): { canEdit: boolean } => ({ canEdit: true }),
}));

test.assertSnapshots(QuotationContainer, [{ props: {}, desc: "should render the quotation list" }]);
