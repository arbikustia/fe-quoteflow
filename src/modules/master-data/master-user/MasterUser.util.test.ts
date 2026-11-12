import { MOCK_API_USERS, MOCK_USER_DETAIL_RESPONSE, MOCK_USER_LIST_RESPONSE } from "@/fixture/master-user";

import { getUserRowNumber, normalizeUserList, normalizeUserResponse } from "./MasterUser.util";

describe("MasterUser util", () => {
  it("should return a loading view while the query is loading", () => {
    expect(normalizeUserList({ data: undefined, isLoading: true, isError: false })).toEqual({
      listStatus: "loading",
      users: [],
      totalPages: 0,
      totalCount: 0,
    });
  });

  it("should return error and missing views", () => {
    expect(normalizeUserList({ data: undefined, isLoading: false, isError: true }).listStatus).toBe("error");
    expect(normalizeUserList({ data: undefined, isLoading: false, isError: false }).listStatus).toBe("missing");
  });

  it("should return a missing view when a row does not match the schema", () => {
    const data = { ...MOCK_USER_LIST_RESPONSE, data: [{ username: "x" }] } as never;

    expect(normalizeUserList({ data, isLoading: false, isError: false }).listStatus).toBe("missing");
  });

  it("should return an empty view when the page has no users", () => {
    const data = { ...MOCK_USER_LIST_RESPONSE, data: [], total_count: 0 };

    expect(normalizeUserList({ data, isLoading: false, isError: false }).listStatus).toBe("empty");
  });

  it("should normalize users with status and date", () => {
    const listView = normalizeUserList({ data: MOCK_USER_LIST_RESPONSE, isLoading: false, isError: false });

    expect(listView.listStatus).toBe("ready");
    expect(listView.totalCount).toBe(2);
    expect(listView.users[0]).toEqual({
      id: "user-1",
      username: "arbikustia14",
      email: "arbi@example.com",
      role: "Administrator",
      status: "active",
      createdAt: "30 Oktober 2026 22:00",
    });
    expect(listView.users[1]).toMatchObject({ username: "johndoe", email: "-", role: "Sales", status: "inactive", createdAt: "-" });
  });

  it("should show placeholders for missing fields and use the first role of a list", () => {
    const empty = { ...MOCK_USER_LIST_RESPONSE, data: [{ id: "user-3" }] };
    const roles = { ...MOCK_USER_LIST_RESPONSE, data: [{ ...MOCK_API_USERS[0], role: ["Admin", "Sales"] }] };

    expect(normalizeUserList({ data: empty, isLoading: false, isError: false }).users[0]).toEqual({
      id: "user-3",
      username: "-",
      email: "-",
      role: "-",
      status: "active",
      createdAt: "-",
    });
    expect(normalizeUserList({ data: roles, isLoading: false, isError: false }).users[0].role).toBe("Admin");
  });

  it("should number rows across pages", () => {
    expect(getUserRowNumber(1, 10, 0)).toBe(1);
    expect(getUserRowNumber(3, 20, 4)).toBe(45);
  });

  it("should unwrap a list response to its first user", () => {
    const response = { ...MOCK_USER_DETAIL_RESPONSE, data: [MOCK_API_USERS[0]] };

    expect(normalizeUserResponse(response).data).toEqual(MOCK_API_USERS[0]);
    expect(normalizeUserResponse({ ...response, data: [] }).data).toBeNull();
    expect(normalizeUserResponse(MOCK_USER_DETAIL_RESPONSE).data).toEqual(MOCK_API_USERS[0]);
  });
});
