import { _mapRole, masterRoleApi } from "./MasterRole.api";
import type { RoleListResponse } from "./MasterRole.type";

const mockApiRole: RoleListResponse["data"][number] = {
  id: "role-1",
  role_name: "Admin",
  status: 1,
  created_at: "2024-01-01",
  created_by: "System",
};

describe("MasterRole API", () => {
  it("should map active API role to UI role", () => {
    const result = _mapRole(mockApiRole);

    expect(result).toEqual({
      id: "role-1",
      roleName: "Admin",
      status: "active",
      createAt: "2024-01-01",
      createBy: "System",
    });
  });

  it("should map inactive API role and explicit empty nullable fields", () => {
    const result = _mapRole({ ...mockApiRole, status: 0, created_at: null, created_by: null });

    expect(result).toEqual({
      id: "role-1",
      roleName: "Admin",
      status: "inactive",
      createAt: "",
      createBy: "",
    });
  });

  it("should expose get roles and create role endpoints", () => {
    expect(masterRoleApi.endpoints.getRoles).toBeDefined();
    expect(masterRoleApi.endpoints.createRole).toBeDefined();
  });
});
