import { MemoryRouter, Route, Routes } from "react-router-dom";

import { MOCK_ROLE_DETAIL_RESPONSE } from "@/fixture/master-role";
import { fireEvent, render, screen, waitFor } from "@/libs/unit-test";
import { useCreateRoleMutation, useGetRoleByIdQuery, useUpdateRoleMutation } from "@/services/master-role.service";

import MasterRoleCreateContainer from "./MasterRoleCreate.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-role.service", () => ({
  useGetRoleByIdQuery: jest.fn(),
  useCreateRoleMutation: jest.fn(),
  useUpdateRoleMutation: jest.fn(),
}));

const updateRole = jest.fn(() => ({ unwrap: (): Promise<{ status: boolean }> => Promise.resolve({ status: true }) }));

/**
 * Render the container on the given route.
 * @param {string} pathname - Initial route
 * @returns {void}
 */
const renderAt = (pathname: string): void => {
  render(
    <MemoryRouter initialEntries={[pathname]}>
      <Routes>
        <Route path="/master-role" element={<p>Role list</p>} />
        <Route path="/master-role/create" element={<MasterRoleCreateContainer />} />
        <Route path="/master-role/edit/:id" element={<MasterRoleCreateContainer />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("MasterRoleCreateContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useGetRoleByIdQuery).mockReturnValue({ data: undefined, isLoading: false, isError: false } as never);
    jest.mocked(useCreateRoleMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
    jest.mocked(useUpdateRoleMutation).mockReturnValue([updateRole, { isLoading: false }] as never);
  });

  it("should render an empty create form", () => {
    renderAt("/master-role/create");

    expect(screen.getByRole("button", { name: "Create Role" })).toBeInTheDocument();
  });

  it("should seed the form from the detail query and submit the update", async () => {
    jest.mocked(useGetRoleByIdQuery).mockReturnValue({ data: MOCK_ROLE_DETAIL_RESPONSE, isLoading: false, isError: false } as never);
    renderAt("/master-role/edit/role-1");

    expect(useGetRoleByIdQuery).toHaveBeenCalledWith("role-1", { skip: false });
    expect(screen.getByDisplayValue("Administrator")).toBeInTheDocument();
    fireEvent.submit(screen.getByRole("button", { name: "Update Role" }));

    await waitFor(() => expect(screen.getByText("Role list")).toBeInTheDocument());
    expect(updateRole).toHaveBeenCalledWith({ id: "role-1", role: "Administrator", status: 1 });
  });

  it("should show the error message when the detail query fails", () => {
    jest.mocked(useGetRoleByIdQuery).mockReturnValue({ data: undefined, isLoading: false, isError: true } as never);
    renderAt("/master-role/edit/role-1");

    expect(screen.getByText("Unable to load role data. Please try again.")).toBeInTheDocument();
  });
});
