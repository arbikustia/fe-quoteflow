import type { ReactNode } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { act, renderHook, waitFor } from "@/libs/unit-test";

import { usePermissionAssign } from "./PermissionAssign.hook";

const mockNavigate = jest.fn();
const mockSave = jest.fn();
const mockPermissionQuery = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: (): jest.Mock => mockNavigate,
}));
jest.mock("@/services/master-user.service", () => ({ useGetUsersQuery: (): unknown => ({ data: { data: [{ username: "admin" }] }, isLoading: false }) }));
jest.mock("@/services/permission.service", () => ({
  useGetUserPermissionQuery: (...args: unknown[]): unknown => mockPermissionQuery(...args),
  useSaveUserPermissionMutation: (): unknown => [mockSave, { isLoading: false }],
}));

/**
 * Wrap the hook in the assign route for a username.
 * @param {string} username - Route username
 * @returns {({ children }: { children: ReactNode }) => ReactNode} - Wrapper
 */
const createWrapper = (username: string): (({ children }: { children: ReactNode }) => ReactNode) =>
  ({ children }: { children: ReactNode }): ReactNode => (
    <MemoryRouter initialEntries={[`/permission/assign/${username}`]}>
      <Routes><Route path="/permission/assign/:username" element={children} /></Routes>
    </MemoryRouter>
  );

describe("usePermissionAssign", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPermissionQuery.mockReturnValue({ data: { status: true, data: { menus: [{ menu: "Dashboard", pages: [{ page: "Dashboard", url: "/home", permission: ["view"] }] }] } } });
  });

  it("should merge the loaded permissions into the matrix", () => {
    const { result } = renderHook(() => usePermissionAssign(), { wrapper: createWrapper("admin") });

    expect(result.current.username).toBe("admin");
    expect(result.current.formPages.find((page) => page.url === "/home")?.permission).toEqual(["view"]);
    expect(result.current.isPartiallySelected).toBe(true);
  });

  it("should treat the all route as no user and skip saving", async () => {
    const { result } = renderHook(() => usePermissionAssign(), { wrapper: createWrapper("all") });

    expect(result.current.username).toBe("");
    expect(mockPermissionQuery).toHaveBeenLastCalledWith("", { skip: true });
    await act(() => result.current.onSubmit());
    expect(mockSave).not.toHaveBeenCalled();
  });

  it("should toggle actions, rows and everything", () => {
    const { result } = renderHook(() => usePermissionAssign(), { wrapper: createWrapper("admin") });
    const url = result.current.formPages[1].url;

    act(() => result.current.onSelectAllChange(true));
    expect(result.current.isAllSelected).toBe(true);
    act(() => result.current.onRowSelectChange(url, false));
    expect(result.current.formPages[1].permission).toEqual([]);
    act(() => result.current.onPermissionChange(url, "view", true));
    expect(result.current.formPages[1].permission).toEqual(["view"]);
  });

  it("should navigate back to the list after a successful save", async () => {
    mockSave.mockReturnValue({ unwrap: (): Promise<{ status: boolean }> => Promise.resolve({ status: true }) });
    const { result } = renderHook(() => usePermissionAssign(), { wrapper: createWrapper("admin") });

    await act(() => result.current.onSubmit());
    expect(mockNavigate).toHaveBeenCalledWith("/permission", { state: { message: "Permissions saved successfully." } });
  });

  it("should show an error when the save is rejected or fails", async () => {
    mockSave.mockReturnValueOnce({ unwrap: (): Promise<{ status: boolean }> => Promise.resolve({ status: false }) });
    const { result } = renderHook(() => usePermissionAssign(), { wrapper: createWrapper("admin") });

    await act(() => result.current.onSubmit());
    expect(result.current.formMessage).toBe("Unable to save permissions.");
    mockSave.mockReturnValueOnce({ unwrap: (): Promise<never> => Promise.reject(new Error("x")) });
    await act(() => result.current.onSubmit());
    await waitFor(() => expect(result.current.formMessage).toBe("Unable to save permissions."));
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should switch user, ignore an empty selection and cancel", () => {
    const { result } = renderHook(() => usePermissionAssign(), { wrapper: createWrapper("admin") });

    result.current.onUserChange("");
    expect(mockNavigate).not.toHaveBeenCalled();
    result.current.onUserChange("staff");
    expect(mockNavigate).toHaveBeenCalledWith("/permission/assign/staff");
    result.current.onCancel();
    expect(mockNavigate).toHaveBeenLastCalledWith("/permission");
  });
});
