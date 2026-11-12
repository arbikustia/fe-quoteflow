import { MemoryRouter } from "react-router-dom";

import { MOCK_USER_LIST_RESPONSE } from "@/fixture/master-user";
import { usePagePermission } from "@/hooks/usePagePermission";
import { render, screen } from "@/libs/unit-test";
import { useGetUsersQuery } from "@/services/master-user.service";

import MasterUserContainer from "./MasterUser.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-user.service", () => ({ useGetUsersQuery: jest.fn() }));
jest.mock("@/hooks/usePagePermission", () => ({ usePagePermission: jest.fn() }));

/**
 * Render the container inside a router.
 * @param {string} [successMessage] - Router state success message
 * @returns {void}
 */
const renderContainer = (successMessage?: string): void => {
  render(
    <MemoryRouter initialEntries={[{ pathname: "/master-user", state: { successMessage } }]}>
      <MasterUserContainer />
    </MemoryRouter>,
  );
};

describe("MasterUserContainer", () => {
  beforeEach(() => {
    jest.mocked(useGetUsersQuery).mockReturnValue({ data: MOCK_USER_LIST_RESPONSE, isLoading: false, isError: false } as never);
    jest.mocked(usePagePermission).mockReturnValue({ canView: true, canCreate: true, canEdit: true, isSuperadmin: false, isLoading: false });
  });

  it("should query the first page and render normalized users", () => {
    renderContainer();

    expect(useGetUsersQuery).toHaveBeenCalledWith({ PageNumber: 1, PageSize: 10, SearchTerm: "" });
    expect(usePagePermission).toHaveBeenCalledWith("/master-user");
    expect(screen.getAllByText("johndoe")).toHaveLength(2);
    expect(screen.getAllByText("inactive")).toHaveLength(2);
  });

  it("should hide create and edit actions without permission", () => {
    jest.mocked(usePagePermission).mockReturnValue({ canView: true, canCreate: false, canEdit: false, isSuperadmin: false, isLoading: false });

    renderContainer();

    expect(screen.queryByRole("button", { name: "Create User" })).not.toBeInTheDocument();
    expect(screen.queryAllByRole("button", { name: /^Edit User/ })).toHaveLength(0);
  });

  it("should show the success message from router state", () => {
    renderContainer("User updated successfully.");

    expect(screen.getByRole("alert")).toHaveTextContent("User updated successfully.");
  });
});
