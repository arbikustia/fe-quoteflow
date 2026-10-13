import { _mapUser } from "./MasterUser.api";
import type { ApiUser } from "./MasterUser.type";

describe("_mapUser", () => {
  it("should preserve API values and mark unavailable fields as null", () => {
    const apiUser: ApiUser = {
      id: "user-1",
      username: "admin",
      password: "secret",
      email: "admin@example.com",
      last_created: "2026-10-13T00:00:00Z",
    };

    expect(_mapUser(apiUser)).toEqual({
      id: "user-1",
      username: "admin",
      role: null,
      status: null,
      createAt: "2026-10-13T00:00:00Z",
      createBy: null,
    });
  });
});
