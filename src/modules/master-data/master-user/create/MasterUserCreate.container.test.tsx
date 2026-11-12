import { MemoryRouter, Route, Routes } from "react-router-dom";

import { MOCK_ROLE_ALL_RESPONSE } from "@/fixture/master-role";
import { MOCK_USER_DETAIL_RESPONSE } from "@/fixture/master-user";
import { fireEvent, render, screen, waitFor } from "@/libs/unit-test";
import { useGetAllRolesQuery } from "@/services/master-role.service";
import { useCreateUserMutation, useGetUserByIdQuery, useUpdateUserMutation } from "@/services/master-user.service";

import MasterUserCreateContainer from "./MasterUserCreate.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-user.service", () => ({
  useGetUserByIdQuery: jest.fn(),
  useCreateUserMutation: jest.fn(),
  useUpdateUserMutation: jest.fn(),
}));
jest.mock("@/services/master-role.service", () => ({ useGetAllRolesQuery: jest.fn() }));

const updateUser = jest.fn(() => ({ unwrap: (): Promise<{ status: boolean }> => Promise.resolve({ status: true }) }));
jest.mock("@/services/master-role.service", () => ({ useGetAllRolesQuery: jest.fn() }));

/**
 * Render the container on the given route.
 * @param {string} pathname - Initial route
 * @returns {void}
 */
const renderAt = (pathname: string): void => {
  render(
    <MemoryRouter initialEntries={[pathname]}>
      <Routes>
        <Route path="/master-user" element={<p>User list</p>} />
        <Route path="/master-user/create" element={<MasterUserCreateContainer />} />
        <Route path="/master-user/edit/:id" element={<MasterUserCreateContainer />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("MasterUserCreateContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useGetUserByIdQuery).mockReturnValue({ data: undefined, isLoading: false, isError: false } as never);
    jest.mocked(useGetAllRolesQuery).mockReturnValue({ data: MOCK_ROLE_ALL_RESPONSE, isLoading: false, isError: false } as never);
    jest.mocked(useCreateUserMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
    jest.mocked(useUpdateUserMutation).mockReturnValue([updateUser, { isLoading: false }] as never);
  });

  it("should render an empty create form", () => {
    renderAt("/master-user/create");

    expect(screen.getByRole("button", { name: "Create User" })).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/)).toBeInTheDocument();
  });

  it("should seed the form from the detail query and submit the update", async () => {
    jest.mocked(useGetUserByIdQuery).mockReturnValue({ data: MOCK_USER_DETAIL_RESPONSE, isLoading: false, isError: false } as never);
    renderAt("/master-user/edit/user-1");

    expect(useGetUserByIdQuery).toHaveBeenCalledWith("user-1", { skip: false });
    expect(screen.getByDisplayValue("arbikustia14")).toBeInTheDocument();
    fireEvent.submit(screen.getByRole("button", { name: "Update User" }));
jest.mock("@/services/master-role.service", () => ({ useGetAllRolesQuery: jest.fn() }));

    await waitFor(() => expect(screen.getByText("User list")).toBeInTheDocument());
    expect(updateUser).toHaveBeenCalledWith({ id: "user-1", username: "arbikustia14", email: "arbi@example.com", role: ["Administrator"], status: 1 });
  });

  it("should show the error message when the detail query fails", () => {
    jest.mocked(useGetUserByIdQuery).mockReturnValue({ data: undefined, isLoading: false, isError: true } as never);
    renderAt("/master-user/edit/user-1");

    expect(screen.getByText("Unable to load user data. Please try again.")).toBeInTheDocument();
  });
});
