import type * as React from "react";

import { render, screen } from "@/libs/unit-test";

import PaymentStatusContainer from "./PaymentStatus.container";

jest.mock("./PaymentStatus.hook", () => ({ usePaymentStatusForm: (): Record<string, never> => ({}) }));
jest.mock("./PaymentStatus.component", () => ({
  PaymentStatusForm: (): React.ReactElement => <div>PaymentStatusContainer rendered</div>,
}));
jest.mock("@/app/layout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }): React.ReactElement => <div>{children}</div>,
}));

describe("PaymentStatusContainer", (): void => {
  it("should render the module component", (): void => {
    render(<PaymentStatusContainer />);

    expect(screen.getByText("PaymentStatusContainer rendered")).toBeTruthy();
  });
});
