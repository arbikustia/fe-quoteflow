import type * as React from "react";

import { render, screen } from "@/libs/unit-test";

import PaymentContainer from "./Payment.container";

jest.mock("./Payment.hook", () => ({ usePaymentPagination: (): Record<string, never> => ({}), usePaymentNavigation: (): Record<string, never> => ({}) }));
jest.mock("./Payment.component", () => ({
  PaymentComponent: (): React.ReactElement => <div>PaymentContainer rendered</div>,
}));
jest.mock("@/hooks/usePagePermission", () => ({ usePagePermission: (): { canCreate: boolean } => ({ canCreate: true }) }));

describe("PaymentContainer", (): void => {
  it("should render the module component", (): void => {
    render(<PaymentContainer />);

    expect(screen.getByText("PaymentContainer rendered")).toBeTruthy();
  });
});
