import type * as React from "react";

import { render, screen } from "@/libs/unit-test";

import PaymentDetailContainer from "./PaymentDetail.container";

jest.mock("./PaymentDetail.hook", () => ({ usePaymentDetail: (): Record<string, never> => ({}) }));
jest.mock("./PaymentDetail.component", () => ({
  PaymentDetailComponent: (): React.ReactElement => <div>PaymentDetailContainer rendered</div>,
}));

describe("PaymentDetailContainer", (): void => {
  it("should render the module component", (): void => {
    render(<PaymentDetailContainer />);

    expect(screen.getByText("PaymentDetailContainer rendered")).toBeTruthy();
  });
});
