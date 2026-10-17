import { mapRole, masterRoleService } from "@/services/master-role.service";
import type { RoleListResponse } from "./MasterRole.type";

const mockApiRole: RoleListResponse["data"][number] = {
  id: "role-1",
  role: "Admin",
  last_created: "2024-01-01",
};

describe("MasterRole API", () => {
  it("should map active API role to UI role", () => {
    const result = mapRole(mockApiRole);

    expect(result).toEqual({
      id: "role-1",
      roleName: "Admin",
      status: "active",
      createAt: "2024-01-01",
      createBy: "",
    });
  });

  it("should map API role with null created_at", () => {
    const result = mapRole({ ...mockApiRole, last_created: null });

    expect(result).toEqual({
      id: "role-1",
      roleName: "Admin",
      status: "active",
      createAt: "",
      createBy: "",
    });
  });

  it("should expose get roles and create role endpoints", () => {
    expect(masterRoleService.endpoints.getRoles).toBeDefined();
    expect(masterRoleService.endpoints.createRole).toBeDefined();
    expect(masterRoleService.endpoints.updateRole).toBeDefined();
  });
});
