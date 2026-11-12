import { MemoryRouter, Route, Routes } from "react-router-dom";

import { MOCK_API_PAYMENT_METHODS } from "@/fixture/master-payment-method";
import { fireEvent, render, screen, waitFor } from "@/libs/unit-test";
import { useCreatePaymentMethodMutation, useUpdatePaymentMethodMutation } from "@/services/master-payment-method.service";

import type { ApiPaymentMethod } from "../MasterPaymentMethod.type";

import MasterPaymentMethodCreateContainer from "./MasterPaymentMethodCreate.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-payment-method.service", () => ({
  useCreatePaymentMethodMutation: jest.fn(),
  useUpdatePaymentMethodMutation: jest.fn(),
}));

const updatePaymentMethod = jest.fn(() => ({ unwrap: (): Promise<{ status: boolean }> => Promise.resolve({ status: true }) }));

/**
 * Render the container on the given route.
 * @param {string} pathname - Initial route
 * @param {ApiPaymentMethod} [paymentMethod] - Raw record passed through router state
 * @returns {void}
 */
const renderAt = (pathname: string, paymentMethod?: ApiPaymentMethod): void => {
  render(
    <MemoryRouter initialEntries={[{ pathname, state: { paymentMethod } }]}>
      <Routes>
        <Route path="/master-payment-method" element={<p>Payment method list</p>} />
        <Route path="/master-payment-method/create" element={<MasterPaymentMethodCreateContainer />} />
        <Route path="/master-payment-method/edit/:id" element={<MasterPaymentMethodCreateContainer />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("MasterPaymentMethodCreateContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useCreatePaymentMethodMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
    jest.mocked(useUpdatePaymentMethodMutation).mockReturnValue([updatePaymentMethod, { isLoading: false }] as never);
  });

  it("should render an empty create form", () => {
    renderAt("/master-payment-method/create");

    expect(screen.getByRole("button", { name: "Create Payment Method" })).toBeInTheDocument();
  });

  it("should seed the form from router state and submit the update", async () => {
    renderAt("/master-payment-method/edit/payment-method-1", MOCK_API_PAYMENT_METHODS[0]);

    expect(screen.getByDisplayValue("BCA")).toBeInTheDocument();
    expect(screen.getByDisplayValue("No Admin Fee")).toBeInTheDocument();
    fireEvent.submit(screen.getByRole("button", { name: "Update Payment Method" }));

    await waitFor(() => expect(screen.getByText("Payment method list")).toBeInTheDocument());
    expect(updatePaymentMethod).toHaveBeenCalledWith({ id: "payment-method-1", name: "BCA", description: "No Admin Fee", status: 1 });
  });

  it("should show the unavailable message when opened without router state", () => {
    renderAt("/master-payment-method/edit/payment-method-1");

    expect(screen.getByText("Payment method data is unavailable. Open the payment method from the payment method list to edit it.")).toBeInTheDocument();
  });
});
