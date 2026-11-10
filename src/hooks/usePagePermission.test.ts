import { describe, expect, it, jest } from "@jest/globals";
import { renderHook } from "@/libs/unit-test";
import { usePagePermission } from "./usePagePermission";

jest.mock("@/services/permission.service", () => ({
  useGetUserPermissionQuery: () => ({
    data: {
      status: true,
      data: {
        menus: [
          {
            menu: "Document",
            pages: [
              { page: "Quotation", url: "/document/quotation", permission: ["view", "create", "edit"] },
              { page: "Invoice", url: "/document/invoice", permission: ["view"] },
              { page: "Payment", url: "/document/payment", permission: ["view", "create"] },
            ],
          },
          {
            menu: "Order",
            pages: [
              { page: "Create Order", url: "/order/create", permission: ["create"] },
            ],
          },
        ],
      },
    },
    isLoading: false,
  }),
}));

jest.mock("@/services/master-role.service", () => ({
  useGetAllRolesQuery: () => ({ data: { data: [{ id: "1", role: "user", status: 1 }] }, isLoading: false }),
}));

jest.mock("@/services/master-user.service", () => ({
  useGetUsersQuery: () => ({ data: { data: [{ username: "arbi", role: "user" }] }, isLoading: false }),
}));

jest.mock("@/components/Sidebar/Sidebar.helpers", () => ({
  getUsername: () => "arbi",
  getAccessTokenRoles: () => ["user"],
  findUserRole: () => "user",
  normalizeUserRoles: () => ["user"],
  isSuperadminRole: () => false,
}));

describe("usePagePermission permissions", () => {
  it("should return correct permissions for quotation", () => {
    const { result } = renderHook(() => usePagePermission("/document/quotation"));
    expect(result.current.canView).toBe(true);
    expect(result.current.canCreate).toBe(true);
    expect(result.current.canEdit).toBe(true);
  });

  it("should return correct permissions for invoice", () => {
    const { result } = renderHook(() => usePagePermission("/document/invoice"));
    expect(result.current.canView).toBe(true);
    expect(result.current.canCreate).toBe(false);
    expect(result.current.canEdit).toBe(false);
  });

  it("should return correct permissions for payment", () => {
    const { result } = renderHook(() => usePagePermission("/document/payment"));
    expect(result.current.canView).toBe(true);
    expect(result.current.canCreate).toBe(true);
    expect(result.current.canEdit).toBe(false);
  });

  it("should return correct permissions for order creation", () => {
    const { result } = renderHook(() => usePagePermission("/order/create"));
    expect(result.current.canView).toBe(false);
    expect(result.current.canCreate).toBe(true);
    expect(result.current.canEdit).toBe(false);
  });
});
