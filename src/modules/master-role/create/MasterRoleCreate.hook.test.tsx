import { act, renderHook } from "@testing-library/react";
import * as ReactRouterDom from "react-router-dom";

import { useMasterRoleCreateForm } from "./MasterRoleCreate.hook";

import * as MasterRoleService from "@/services/master-role.service";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("@/services/master-role.service", () => ({
  mapRole: jest.fn((role) => ({
    id: role.id,
    roleName: role.role,
    status: role.status === 0 ? "inactive" : "active",
    createAt: role.last_created,
    createBy: null,
  })),
  useGetRoleByIdQuery: jest.fn(),
  useCreateRoleMutation: jest.fn(),
  useUpdateRoleMutation: jest.fn(),
}));

describe("MasterRoleCreate.hook", () => {
  const mockNavigate = jest.fn();
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(ReactRouterDom.useNavigate).mockReturnValue(mockNavigate);
    jest.mocked(ReactRouterDom.useLocation).mockReturnValue({ state: null } as never);
    jest.mocked(ReactRouterDom.useParams).mockReturnValue({});
    jest.mocked(MasterRoleService.useGetRoleByIdQuery).mockReturnValue({ data: undefined } as never);
    jest.mocked(MasterRoleService.useCreateRoleMutation).mockReturnValue([
      mockCreate,
      { isLoading: false },
    ] as never);
    jest.mocked(MasterRoleService.useUpdateRoleMutation).mockReturnValue([
      mockUpdate,
      { isLoading: false },
    ] as never);
  });

  it("should initialize default create state", () => {
    const { result } = renderHook(() => useMasterRoleCreateForm());

    expect(result.current.roleName).toBe("");
    expect(result.current.isActive).toBe(true);
    expect(result.current.isEditMode).toBe(false);
  });

  it("should initialize edit state from route role", () => {
    jest.mocked(ReactRouterDom.useParams).mockReturnValue({ id: "role-1" });
    jest.mocked(ReactRouterDom.useLocation).mockReturnValue({
      state: {
        role: {
          id: "role-1",
          roleName: "Manager",
          status: "inactive",
          createAt: null,
          createBy: null,
        },
      },
    } as never);

    const { result } = renderHook(() => useMasterRoleCreateForm());

    expect(result.current.roleName).toBe("Manager");
    expect(result.current.isActive).toBe(false);
    expect(result.current.isEditMode).toBe(true);
  });

  it("should handle field changes and back navigation", () => {
    const { result } = renderHook(() => useMasterRoleCreateForm());

    act(() => {
      result.current.handleRoleNameChange({ target: { value: "Auditor" } } as React.ChangeEvent<HTMLInputElement>);
      result.current.handleStatusChange();
      result.current.goBack();
    });

    expect(result.current.roleName).toBe("Auditor");
    expect(result.current.isActive).toBe(false);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("should submit create mutation and navigate to list", async () => {
    mockCreate.mockReturnValue({ unwrap: () => Promise.resolve({ status: true }) });
    const { result } = renderHook(() => useMasterRoleCreateForm());

    act(() => {
      result.current.handleRoleNameChange({ target: { value: "Auditor" } } as React.ChangeEvent<HTMLInputElement>);
    });
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as never);
    });

    expect(mockCreate).toHaveBeenCalledWith({ role: "Auditor", status: 1 });
    expect(mockNavigate).toHaveBeenCalledWith("/master-role");
  });

  it("should display API and validation errors", async () => {
    mockCreate.mockReturnValue({
      unwrap: () => Promise.resolve({ status: false, messages: ["Role exists."] }),
    });
    const { result } = renderHook(() => useMasterRoleCreateForm());

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as never);
    });
    expect(result.current.errorMessage).toBe("Role name is required.");

    act(() => {
      result.current.handleRoleNameChange({ target: { value: "Auditor" } } as React.ChangeEvent<HTMLInputElement>);
    });
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as never);
    });
    expect(result.current.errorMessage).toBe("Role exists.");
  });

  it("should handle mutation exceptions", async () => {
    mockCreate.mockReturnValue({ unwrap: () => Promise.reject(new Error("Network failed")) });
    const { result } = renderHook(() => useMasterRoleCreateForm());

    act(() => {
      result.current.handleRoleNameChange({ target: { value: "Auditor" } } as React.ChangeEvent<HTMLInputElement>);
    });
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as never);
    });

    expect(result.current.errorMessage).toBe("Unable to create role. Please try again.");
  });
});
