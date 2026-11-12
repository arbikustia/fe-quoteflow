import type * as React from "react";

import { render, screen } from "@/libs/unit-test";

import PaymentCreateContainer from "./PaymentCreate.container";

jest.mock("./PaymentCreate.hook", () => ({ usePaymentCreate: (): Record<string, never> => ({}) }));
jest.mock("./PaymentCreate.component", () => ({
  PaymentCreateComponent: (): React.ReactElement => <div>PaymentCreateContainer rendered</div>,
}));
jest.mock("@/app/layout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }): React.ReactElement => <div>{children}</div>,
}));

describe("PaymentCreateContainer", (): void => {
  it("should render the module component", (): void => {
    render(<PaymentCreateContainer />);

    expect(screen.getByText("PaymentCreateContainer rendered")).toBeTruthy();
  });
});
