import { MemoryRouter } from "react-router-dom";

import { MOCK_ORDER_TYPE_LIST_RESPONSE } from "@/fixture/master-order-type";
import { usePagePermission } from "@/hooks/usePagePermission";
import { render, screen } from "@/libs/unit-test";
import { useGetOrderTypesQuery } from "@/services/master-order-type.service";

import MasterOrderTypeContainer from "./MasterOrderType.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-order-type.service", () => ({ useGetOrderTypesQuery: jest.fn() }));
jest.mock("@/hooks/usePagePermission", () => ({ usePagePermission: jest.fn() }));

/**
 * Render the container inside a router.
 * @param {string} [successMessage] - Router state success message
 * @returns {void}
 */
const renderContainer = (successMessage?: string): void => {
  render(
    <MemoryRouter initialEntries={[{ pathname: "/master-order-type", state: { successMessage } }]}>
      <MasterOrderTypeContainer />
    </MemoryRouter>,
  );
};

describe("MasterOrderTypeContainer", () => {
  beforeEach(() => {
    jest.mocked(useGetOrderTypesQuery).mockReturnValue({ data: MOCK_ORDER_TYPE_LIST_RESPONSE, isLoading: false, isError: false } as never);
    jest.mocked(usePagePermission).mockReturnValue({ canView: true, canCreate: true, canEdit: true, isSuperadmin: false, isLoading: false });
  });

  it("should query the first page and render normalized order types", () => {
    renderContainer();

    expect(useGetOrderTypesQuery).toHaveBeenCalledWith({ pageNumber: 1, pageSize: 10, searchTerm: "" });
    expect(usePagePermission).toHaveBeenCalledWith("/master-order-type");
    expect(screen.getAllByText("Pickup")).toHaveLength(2);
    expect(screen.getByText("No Handover")).toBeInTheDocument();
  });

  it("should hide create and edit actions without permission", () => {
    jest.mocked(usePagePermission).mockReturnValue({ canView: true, canCreate: false, canEdit: false, isSuperadmin: false, isLoading: false });

    renderContainer();

    expect(screen.queryByRole("button", { name: "Create Order Type" })).not.toBeInTheDocument();
    expect(screen.queryAllByRole("button", { name: /^Edit order type/ })).toHaveLength(0);
  });

  it("should show the success message from router state", () => {
    renderContainer("Order type updated successfully.");

    expect(screen.getByRole("alert")).toHaveTextContent("Order type updated successfully.");
  });
});
