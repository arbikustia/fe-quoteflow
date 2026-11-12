import { MemoryRouter } from "react-router-dom";

import { MOCK_ITEM_LIST_RESPONSE } from "@/fixture/master-item";
import { usePagePermission } from "@/hooks/usePagePermission";
import { render, screen } from "@/libs/unit-test";
import { useGetItemsQuery } from "@/services/master-item.service";

import MasterItemContainer from "./MasterItem.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-item.service", () => ({ useGetItemsQuery: jest.fn() }));
jest.mock("@/hooks/usePagePermission", () => ({ usePagePermission: jest.fn() }));

/**
 * Render the container inside a router.
 * @param {string} [successMessage] - Router state success message
 * @returns {void}
 */
const renderContainer = (successMessage?: string): void => {
  render(
    <MemoryRouter initialEntries={[{ pathname: "/master-item", state: { successMessage } }]}>
      <MasterItemContainer />
    </MemoryRouter>,
  );
};

describe("MasterItemContainer", () => {
  beforeEach(() => {
    jest.mocked(useGetItemsQuery).mockReturnValue({ data: MOCK_ITEM_LIST_RESPONSE, isLoading: false, isError: false } as never);
    jest.mocked(usePagePermission).mockReturnValue({ canView: true, canCreate: true, canEdit: true, isSuperadmin: false, isLoading: false });
  });

  it("should query the first page and render normalized items", () => {
    renderContainer();

    expect(useGetItemsQuery).toHaveBeenCalledWith({ pageNumber: 1, pageSize: 10, searchTerm: "" });
    expect(usePagePermission).toHaveBeenCalledWith("/master-item");
    expect(screen.getAllByText("Wireless Mic")).toHaveLength(2);
    expect(screen.getAllByText("Rp 100.000").length).toBeGreaterThan(0);
  });

  it("should hide create and edit actions without permission", () => {
    jest.mocked(usePagePermission).mockReturnValue({ canView: true, canCreate: false, canEdit: false, isSuperadmin: false, isLoading: false });

    renderContainer();

    expect(screen.queryByRole("button", { name: "Create Item" })).not.toBeInTheDocument();
    expect(screen.queryAllByRole("button", { name: /^Edit item/ })).toHaveLength(0);
  });

  it("should show the success message from router state", () => {
    renderContainer("Item updated successfully.");

    expect(screen.getByRole("alert")).toHaveTextContent("Item updated successfully.");
  });
});
