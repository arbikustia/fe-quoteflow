import { act, renderHook } from "@testing-library/react";
import * as ReactRouterDom from "react-router-dom";

import { useMasterUserCreateForm } from "./MasterUserCreate.hook";

import * as MasterRoleService from "@/services/master-role.service";
import * as MasterUserService from "@/services/master-user.service";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("@/services/master-user.service", () => ({
  useCreateUserMutation: jest.fn(),
  useUpdateUserMutation: jest.fn(),
  useGetUserByIdQuery: jest.fn(),
  mapUser: jest.fn(),
}));

jest.mock("@/services/master-role.service", () => ({
  useGetAllRolesQuery: jest.fn(),
}));

describe("MasterUserCreate.hook", () => {
  const mockNavigate = jest.fn();
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (ReactRouterDom.useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (ReactRouterDom.useLocation as jest.Mock).mockReturnValue({ state: null });
    (ReactRouterDom.useParams as jest.Mock).mockReturnValue({});

    (MasterUserService.useCreateUserMutation as jest.Mock).mockReturnValue([
      mockCreate,
      { isLoading: false },
    ]);
    (MasterUserService.useUpdateUserMutation as jest.Mock).mockReturnValue([
      mockUpdate,
      { isLoading: false },
    ]);
    (MasterUserService.useGetUserByIdQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
    });
    (MasterRoleService.useGetAllRolesQuery as jest.Mock).mockReturnValue({
      data: { status: true, data: [{ id: "r-1", name: "Admin" }] },
      isLoading: false,
      error: null,
    });
  });

  it("should initialize default create state", () => {
    const { result } = renderHook(() => useMasterUserCreateForm());

    expect(result.current.username).toBe("");
    expect(result.current.email).toBe("");
    expect(result.current.password).toBe("");
    expect(result.current.role).toBe("User");
    expect(result.current.isActive).toBe(true);
    expect(result.current.isEditMode).toBe(false);
    expect(result.current.roleOptions).toHaveLength(1);
    expect(result.current.errorMessage).toBeNull();
  });

  it("should initialize with route data in edit mode", () => {
    (ReactRouterDom.useParams as jest.Mock).mockReturnValue({ id: "u-1" });
    (ReactRouterDom.useLocation as jest.Mock).mockReturnValue({
      state: {
        user: {
          id: "u-1",
          username: "alice",
          email: "alice@test.com",
          role: "Manager",
          status: "inactive",
        },
      },
    });

    const { result } = renderHook(() => useMasterUserCreateForm());

    expect(result.current.username).toBe("alice");
    expect(result.current.email).toBe("alice@test.com");
    expect(result.current.role).toBe("Manager");
    expect(result.current.isActive).toBe(false);
    expect(result.current.isEditMode).toBe(true);
  });

  it("should handle inputs, visibility and status toggles", () => {
    const { result } = renderHook(() => useMasterUserCreateForm());

    act(() => {
      result.current.handleUsernameChange({
        target: { value: "new_user" },
      } as React.ChangeEvent<HTMLInputElement>);
      result.current.handleEmailChange({
        target: { value: "new@user.com" },
      } as React.ChangeEvent<HTMLInputElement>);
      result.current.handlePasswordChange({
        target: { value: "password123" },
      } as React.ChangeEvent<HTMLInputElement>);
      result.current.handleRoleChange({
        target: { value: "Admin" },
      } as React.ChangeEvent<HTMLSelectElement>);
    });

    expect(result.current.username).toBe("new_user");
    expect(result.current.email).toBe("new@user.com");
    expect(result.current.password).toBe("password123");
    expect(result.current.role).toBe("Admin");

    act(() => {
      result.current.handleTogglePasswordVisibility();
      result.current.handleStatusChange();
    });

    expect(result.current.isPasswordVisible).toBe(true);
    expect(result.current.isActive).toBe(false);
  });

  it("should trigger back navigation on goBack", () => {
    const { result } = renderHook(() => useMasterUserCreateForm());

    act(() => {
      result.current.goBack();
    });
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("should submit create mutation and navigate to list", async () => {
    mockCreate.mockReturnValue({
      unwrap: () => Promise.resolve({ status: true }),
    });

    const { result } = renderHook(() => useMasterUserCreateForm());

    act(() => {
      result.current.handleUsernameChange({
        target: { value: "charlie" },
      } as React.ChangeEvent<HTMLInputElement>);
      result.current.handleEmailChange({
        target: { value: "charlie@test.com" },
      } as React.ChangeEvent<HTMLInputElement>);
      result.current.handlePasswordChange({
        target: { value: "mypassword" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.SyntheticEvent);
    });

    expect(mockCreate).toHaveBeenCalledWith({
      username: "charlie",
      email: "charlie@test.com",
      password: "mypassword",
      role: ["User"],
      status: 1,
    });
    expect(mockNavigate).toHaveBeenCalledWith("/master-user");
  });

  it("should handle error response and rejection on submit", async () => {
    mockCreate.mockReturnValue({
      unwrap: () => Promise.resolve({ status: false }),
    });

    const { result } = renderHook(() => useMasterUserCreateForm());

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.SyntheticEvent);
    });

    expect(result.current.errorMessage).toBe("User request failed.");

    mockCreate.mockReturnValue({
      unwrap: () => Promise.reject(new Error("API Error")),
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.SyntheticEvent);
    });

    expect(result.current.errorMessage).toBe("Unable to create user. Please try again.");
  });
});
