import { MOCK_API_ROLES, MOCK_ROLE_DETAIL_RESPONSE, MOCK_ROLE_LIST_RESPONSE } from "@/fixture/master-role";

import { getRoleRowNumber, normalizeRoleList, normalizeRoleResponse } from "./MasterRole.util";

describe("MasterRole util", () => {
  it("should return a loading view while the query is loading", () => {
    expect(normalizeRoleList({ data: undefined, isLoading: true, isError: false })).toEqual({
      listStatus: "loading",
      roles: [],
      totalPages: 0,
      totalCount: 0,
    });
  });

  it("should return error and missing views", () => {
    expect(normalizeRoleList({ data: undefined, isLoading: false, isError: true }).listStatus).toBe("error");
    expect(normalizeRoleList({ data: undefined, isLoading: false, isError: false }).listStatus).toBe("missing");
  });

  it("should return a missing view when a row does not match the schema", () => {
    const data = { ...MOCK_ROLE_LIST_RESPONSE, data: [{ name: "x" }] } as never;

    expect(normalizeRoleList({ data, isLoading: false, isError: false }).listStatus).toBe("missing");
  });

  it("should return an empty view when the page has no roles", () => {
    const data = { ...MOCK_ROLE_LIST_RESPONSE, data: [], total_count: 0 };

    expect(normalizeRoleList({ data, isLoading: false, isError: false }).listStatus).toBe("empty");
  });

  it("should normalize roles with status and date", () => {
    const listView = normalizeRoleList({ data: MOCK_ROLE_LIST_RESPONSE, isLoading: false, isError: false });

    expect(listView.listStatus).toBe("ready");
    expect(listView.totalCount).toBe(2);
    expect(listView.roles[0]).toEqual({
      id: "role-1",
      name: "Administrator",
      status: "active",
      createdAt: "30 Oktober 2026 22:00",
    });
    expect(listView.roles[1]).toMatchObject({ name: "Sales", status: "inactive", createdAt: "-" });
  });

  it("should show a placeholder for a missing name", () => {
    const data = { ...MOCK_ROLE_LIST_RESPONSE, data: [{ ...MOCK_API_ROLES[1], role: null }] };

    expect(normalizeRoleList({ data, isLoading: false, isError: false }).roles[0].name).toBe("-");
  });

  it("should number rows across pages", () => {
    expect(getRoleRowNumber(1, 10, 0)).toBe(1);
    expect(getRoleRowNumber(3, 20, 4)).toBe(45);
  });

  it("should unwrap a list response to its first role", () => {
    const response = { ...MOCK_ROLE_DETAIL_RESPONSE, data: [MOCK_API_ROLES[0]] };

    expect(normalizeRoleResponse(response).data).toEqual(MOCK_API_ROLES[0]);
    expect(normalizeRoleResponse({ ...response, data: [] }).data).toBeNull();
    expect(normalizeRoleResponse(MOCK_ROLE_DETAIL_RESPONSE).data).toEqual(MOCK_API_ROLES[0]);
  });
});
