import { act, renderHook } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";

import { useCreateRoleMutation, useGetRolesQuery } from "./MasterRole.api";
import {
  useMasterRoleContainerState,
  useMasterRoleCreateRole,
  useMasterRoleNavigation,
  useMasterRolePagination,
} from "./MasterRole.hook";
import type { RoleData } from "./MasterRole.type";

jest.mock("./MasterRole.api", () => ({
  _mapRole: (role: { readonly id: string; readonly role_name: string; readonly status: number; readonly created_at: string | null; readonly created_by: string | null }) => ({
    id: role.id,
    roleName: role.role_name,
    status: role.status === 1 ? "active" : "inactive",
    createAt: role.created_at ?? "",
    createBy: role.created_by ?? "",
  }),
  useGetRolesQuery: jest.fn(),
  useCreateRoleMutation: jest.fn(),
}));

const mockQueryResult = {
  data: { data: [], total_pages: 0, total_count: 0, has_next: false, has_previous: false, page_number: 1 },
  error: undefined,
  isLoading: false,
};

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

const mockNavigate = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(useGetRolesQuery).mockReturnValue(mockQueryResult as never);
});

describe("MasterRole Navigation Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as ReturnType<typeof jest.fn>).mockReturnValue(mockNavigate);
  });

  it("should provide navigation functions", () => {
    const { result } = renderHook(() => useMasterRoleNavigation(), { wrapper: MemoryRouter });
    expect(result.current).toHaveProperty("goBack");
    expect(result.current).toHaveProperty("goCreate");
    expect(result.current).toHaveProperty("goEdit");
    expect(result.current).toHaveProperty("goDetail");
  });

  it("should trigger correct navigation paths", () => {
    const { result } = renderHook(() => useMasterRoleNavigation(), { wrapper: MemoryRouter });
    
    act(() => result.current.goBack());
    expect(mockNavigate).toHaveBeenCalledWith(-1);

    act(() => result.current.goCreate());
    expect(mockNavigate).toHaveBeenCalledWith("/master-role/create");

    const editRole: RoleData = { id: "1", roleName: "Admin", status: "active", createAt: "", createBy: "" };
    const detailRole: RoleData = { id: "2", roleName: "Viewer", status: "inactive", createAt: "", createBy: "" };

    act(() => result.current.goEdit(editRole));
    expect(mockNavigate).toHaveBeenCalledWith("/master-role/edit/1");

    act(() => result.current.goDetail(detailRole));
    expect(mockNavigate).toHaveBeenCalledWith("/master-role/detail/2");
  });
});

describe("MasterRole Container State Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should derive API-backed pagination state", () => {
    const role: RoleData = { id: "1", roleName: "Admin", status: "active", createAt: "", createBy: "" };
    jest.mocked(useGetRolesQuery).mockReturnValue({ ...mockQueryResult, data: { ...mockQueryResult.data, data: [{ id: "1", role_name: "Admin", status: 1, created_at: null, created_by: null }], total_pages: 2, total_count: 1, has_next: true } } as never);
    const { result } = renderHook(() => useMasterRolePagination(), { wrapper: MemoryRouter });
    expect(result.current.paginatedData).toEqual([role]);
    act(() => result.current.nextPage());
    expect(result.current.currentPage).toBe(2);
  });

  it("should expose create role mutation hook", () => {
    jest.mocked(useCreateRoleMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
    renderHook(() => useMasterRoleCreateRole(), { wrapper: MemoryRouter });
    expect(useCreateRoleMutation).toHaveBeenCalled();
  });

  it("should provide container state", () => {
    const { result } = renderHook(() => useMasterRoleContainerState(), { wrapper: MemoryRouter });
    expect(result.current).toHaveProperty("pagination");
    expect(result.current.pagination).toHaveProperty("paginatedData");
    expect(result.current).toHaveProperty("isMoreOpen");
  });

  it("should toggle more menu", () => {
    const { result } = renderHook(() => useMasterRoleContainerState(), { wrapper: MemoryRouter });
    expect(result.current.isMoreOpen).toBe(false);

    act(() => result.current.toggleMore());
    expect(result.current.isMoreOpen).toBe(true);

    act(() => result.current.handleCloseMore());
    expect(result.current.isMoreOpen).toBe(false);
  });

  it("should handle delete action", () => {
    const { result } = renderHook(() => useMasterRoleContainerState(), { wrapper: MemoryRouter });
    act(() => result.current.toggleMore());
    expect(result.current.isMoreOpen).toBe(true);

    act(() => result.current.goDelete());
    expect(result.current.isMoreOpen).toBe(false);
  });
});
