import type { ApiBaseData } from "@/types/api.type";

import { normalizeRoleDetailResponse } from "./master-role.service";

const role = { id: "role-1", role: "Admin", status: 1 };

describe("normalizeRoleDetailResponse", () => {
  it.each<ApiBaseData>([
    { status: true, data: role, messages: [] },
    { status: true, data: [role], messages: [] },
  ])("should normalize role detail into one object shape", (response) => {
    expect(normalizeRoleDetailResponse(response)).toEqual({
      status: true,
      data: role,
      messages: [],
    });
  });

  it.each([null, []])("should omit missing role data and normalize one message", (data) => {
    expect(normalizeRoleDetailResponse({ status: false, data, messages: "Not found" })).toEqual({
      status: false,
      messages: ["Not found"],
    });
  });

  it("should omit incomplete role data", () => {
    expect(normalizeRoleDetailResponse({ status: false, data: { id: "role-1" }, messages: [] })).toEqual({
      status: false,
      messages: [],
    });
  });

  it("should preserve inactive status zero", () => {
    expect(normalizeRoleDetailResponse({ status: true, data: { ...role, status: 0 }, messages: [] }).data?.status).toBe(0);
  });
});
