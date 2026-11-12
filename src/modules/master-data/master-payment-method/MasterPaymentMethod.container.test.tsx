import { MemoryRouter } from "react-router-dom";

import { MOCK_PAYMENT_METHOD_LIST_RESPONSE } from "@/fixture/master-payment-method";
import { usePagePermission } from "@/hooks/usePagePermission";
import { render, screen } from "@/libs/unit-test";
import { useGetPaymentMethodsQuery } from "@/services/master-payment-method.service";

import MasterPaymentMethodContainer from "./MasterPaymentMethod.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-payment-method.service", () => ({ useGetPaymentMethodsQuery: jest.fn() }));
jest.mock("@/hooks/usePagePermission", () => ({ usePagePermission: jest.fn() }));

/**
 * Render the container inside a router.
 * @param {string} [successMessage] - Router state success message
 * @returns {void}
 */
const renderContainer = (successMessage?: string): void => {
  render(
    <MemoryRouter initialEntries={[{ pathname: "/master-payment-method", state: { successMessage } }]}>
      <MasterPaymentMethodContainer />
    </MemoryRouter>,
  );
};

describe("MasterPaymentMethodContainer", () => {
  beforeEach(() => {
    jest.mocked(useGetPaymentMethodsQuery).mockReturnValue({ data: MOCK_PAYMENT_METHOD_LIST_RESPONSE, isLoading: false, isError: false } as never);
    jest.mocked(usePagePermission).mockReturnValue({ canView: true, canCreate: true, canEdit: true, isSuperadmin: false, isLoading: false });
  });

  it("should query the first page and render normalized payment methods", () => {
    renderContainer();

    expect(useGetPaymentMethodsQuery).toHaveBeenCalledWith({ pageNumber: 1, pageSize: 10, searchTerm: "" });
    expect(usePagePermission).toHaveBeenCalledWith("/master-payment-method");
    expect(screen.getAllByText("BRI")).toHaveLength(2);
    expect(screen.getAllByText("No description")).toHaveLength(2);
    expect(screen.getAllByText("inactive")).toHaveLength(2);
  });

  it("should hide create and edit actions without permission", () => {
    jest.mocked(usePagePermission).mockReturnValue({ canView: true, canCreate: false, canEdit: false, isSuperadmin: false, isLoading: false });

    renderContainer();

    expect(screen.queryByRole("button", { name: "Create Payment Method" })).not.toBeInTheDocument();
    expect(screen.queryAllByRole("button", { name: /^Edit Payment Method/ })).toHaveLength(0);
  });

  it("should show the success message from router state", () => {
    renderContainer("Payment method updated successfully.");

    expect(screen.getByRole("alert")).toHaveTextContent("Payment method updated successfully.");
  });
});
