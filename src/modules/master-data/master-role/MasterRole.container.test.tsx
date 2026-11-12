import { MemoryRouter } from "react-router-dom";

import { MOCK_ROLE_LIST_RESPONSE } from "@/fixture/master-role";
import { usePagePermission } from "@/hooks/usePagePermission";
import { render, screen } from "@/libs/unit-test";
import { useGetRolesQuery } from "@/services/master-role.service";

import MasterRoleContainer from "./MasterRole.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-role.service", () => ({ useGetRolesQuery: jest.fn() }));
jest.mock("@/hooks/usePagePermission", () => ({ usePagePermission: jest.fn() }));

/**
 * Render the container inside a router.
 * @param {string} [successMessage] - Router state success message
 * @returns {void}
 */
const renderContainer = (successMessage?: string): void => {
  render(
    <MemoryRouter initialEntries={[{ pathname: "/master-role", state: { successMessage } }]}>
      <MasterRoleContainer />
    </MemoryRouter>,
  );
};

describe("MasterRoleContainer", () => {
  beforeEach(() => {
    jest.mocked(useGetRolesQuery).mockReturnValue({ data: MOCK_ROLE_LIST_RESPONSE, isLoading: false, isError: false } as never);
    jest.mocked(usePagePermission).mockReturnValue({ canView: true, canCreate: true, canEdit: true, isSuperadmin: false, isLoading: false });
  });

  it("should query the first page and render normalized roles", () => {
    renderContainer();

    expect(useGetRolesQuery).toHaveBeenCalledWith({ pageNumber: 1, pageSize: 10, searchTerm: "" });
    expect(usePagePermission).toHaveBeenCalledWith("/master-role");
    expect(screen.getAllByText("Sales")).toHaveLength(2);
    expect(screen.getAllByText("inactive")).toHaveLength(2);
  });

  it("should hide create and edit actions without permission", () => {
    jest.mocked(usePagePermission).mockReturnValue({ canView: true, canCreate: false, canEdit: false, isSuperadmin: false, isLoading: false });

    renderContainer();

    expect(screen.queryByRole("button", { name: "Create Role" })).not.toBeInTheDocument();
    expect(screen.queryAllByRole("button", { name: /^Edit Role/ })).toHaveLength(0);
  });

  it("should show the success message from router state", () => {
    renderContainer("Role updated successfully.");

    expect(screen.getByRole("alert")).toHaveTextContent("Role updated successfully.");
  });
});
