import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { act, renderHook } from "@/libs/unit-test";

import { usePermissionRows, usePermissionState, usePermissionUsers } from "./Permission.hook";

const mockNavigate = jest.fn();
const mockUsersQuery = jest.fn();
const mockPermissionQuery = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: (): jest.Mock => mockNavigate,
}));
jest.mock("@/services/master-user.service", () => ({ useGetUsersQuery: (...args: unknown[]): unknown => mockUsersQuery(...args) }));
jest.mock("@/services/permission.service", () => ({ useGetUserPermissionQuery: (...args: unknown[]): unknown => mockPermissionQuery(...args) }));

const MENUS = [{ menu: "Document", pages: [{ page: "Quotation", url: "/quotation", permission: ["view"] }, { page: "Invoice", url: "/invoice", permission: ["edit"] }] }];

/**
 * Wrap a hook in a router with optional location state.
 * @param {object} [state] - Location state
 * @returns {({ children }: { children: ReactNode }) => ReactNode} - Wrapper
 */
const createWrapper = (state?: { message: string }): (({ children }: { children: ReactNode }) => ReactNode) =>
  ({ children }: { children: ReactNode }): ReactNode => <MemoryRouter initialEntries={[{ pathname: "/permission", state }]}>{children}</MemoryRouter>;

describe("Permission hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsersQuery.mockReturnValue({ data: { data: [{ username: "admin" }, { username: "" }] }, isLoading: false, isError: false });
    mockPermissionQuery.mockReturnValue({ data: { status: true, data: { menus: MENUS } }, isLoading: false, isError: false });
  });

  it("should build user options and search remotely", () => {
    const { result } = renderHook(() => usePermissionUsers());

    expect(result.current.userOptions).toEqual([{ label: "admin", value: "admin" }]);
    act(() => result.current.onUserSearch("adm"));
    expect(mockUsersQuery).toHaveBeenLastCalledWith({ PageNumber: 1, PageSize: 100, SearchTerm: "adm" });
  });

  it("should skip the permission query without a username and filter rows", () => {
    const { result } = renderHook(() => usePermissionRows("admin", "invoice"));

    expect(result.current.rows.map((row) => row.page)).toEqual(["Invoice"]);
    renderHook(() => usePermissionRows("", ""));
    expect(mockPermissionQuery).toHaveBeenLastCalledWith("", { skip: true });
  });

  it("should flag a rejected permission response as an error", () => {
    mockPermissionQuery.mockReturnValue({ data: { status: false }, isLoading: false, isError: false });
    const { result } = renderHook(() => usePermissionRows("admin", ""));

    expect(result.current.isPermissionError).toBe(true);
    expect(result.current.rows).toEqual([]);
  });

  it("should select a user, expose rows and the saved message", () => {
    const { result } = renderHook(() => usePermissionState(), { wrapper: createWrapper({ message: "Permissions saved successfully." }) });

    expect(result.current.formMessage).toBe("Permissions saved successfully.");
    expect(result.current.isEmpty).toBe(false);
    act(() => result.current.onUsernameChange("admin"));
    expect(result.current.selectedUsername).toBe("admin");
    expect(result.current.rows).toHaveLength(2);
  });

  it("should report an empty permission list for the selected user", () => {
    mockPermissionQuery.mockReturnValue({ data: { status: true, data: { menus: [] } }, isLoading: false, isError: false });
    const { result } = renderHook(() => usePermissionState(), { wrapper: createWrapper() });

    act(() => result.current.onUsernameChange("admin"));
    expect(result.current.isEmpty).toBe(true);
  });

  it("should navigate to assign, assign all and back", () => {
    const { result } = renderHook(() => usePermissionState(), { wrapper: createWrapper() });

    result.current.onOpenForm();
    expect(mockNavigate).toHaveBeenLastCalledWith("/permission/assign/all");
    act(() => result.current.onUsernameChange("admin"));
    result.current.onOpenForm();
    expect(mockNavigate).toHaveBeenLastCalledWith("/permission/assign/admin");
    result.current.onBack();
    expect(mockNavigate).toHaveBeenLastCalledWith("/home");
  });
});
