import type * as React from "react";

import { render, screen } from "@/libs/unit-test";

import QuotationDetailContainer from "./QuotationDetail.container";

jest.mock("./QuotationDetail.hook", () => ({
  /**
   * Return detail state.
   * @returns {{ isLoading: boolean }} - Detail state
   */
  useQuotationDetail: (): { isLoading: boolean } => ({ isLoading: true }),
}));
jest.mock("./QuotationDetail.component", () => ({
  /**
   * Render the loading flag.
   * @param {{ isLoading: boolean }} props - Detail state
   * @returns {React.ReactElement} - Mocked page
   */
  QuotationDetailComponent: (props: { isLoading: boolean }): React.ReactElement => <div>{`loading:${String(props.isLoading)}`}</div>,
}));

describe("QuotationDetailContainer", (): void => {
  it("should pass the hook state to the component", (): void => {
    render(<QuotationDetailContainer />);

    expect(screen.getByText("loading:true")).toBeTruthy();
  });
});
